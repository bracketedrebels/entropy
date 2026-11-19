import { createServer } from 'node:http';
import { Observable, share, Subscription } from 'rxjs';

// Эти символы не экспортируются. User space может переносить Request и
// создавать Response только через чистые нативные функции, не трогая сокет.
const token = Symbol('http.exchange');
const responseBrand = Symbol('http.response');
const replyBrand = Symbol('http.reply');
const request = (id, data) => Object.freeze({ [token]: id, data });
const reply = (status, body) => Object.freeze({ [replyBrand]: true, status, body });
export const getPayload = req => req.data;
export const makeOk = data => reply(200, data);
export const makeBadRequest = errors => reply(400, { error: 'validation', issues: errors });
export function makeResponse(req, content) {
  if (!req?.[token] || !content?.[replyBrand]) throw new TypeError('Expected Request and Reply');
  return Object.freeze({ [responseBrand]: true, [token]: req[token], content });
}
export function readQuery(req) {
  const data = Object.create(null);
  // Дубликаты сохраняются массивом: они не пройдут String-валидатор.
  for (const [name, value] of new URL(req.data.url, 'http://entropy.local').searchParams) {
    if (Object.hasOwn(data, name)) {
      data[name] = Array.isArray(data[name]) ? [...data[name], value] : [data[name], value];
    } else data[name] = value;
  }
  return request(req[token], data);
}

export function createHost({ hostname = '127.0.0.1', port = 0, path = '/', timeoutMs = 5000 } = {}) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new RangeError('Invalid port');
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0) throw new RangeError('Invalid timeoutMs');
  if (typeof path !== 'string' || !path.startsWith('/')) throw new TypeError('Invalid path');
  const server = createServer();
  const pending = new Map();
  const subscriptions = new Subscription();
  let state = 'new';
  let startPromise;
  let stopPromise;
  let lastError;
  let activeSinks = 0;

  const write = (res, status, body, headers = {}) => {
    if (res.destroyed || res.writableEnded) return;
    const encoded = JSON.stringify(body);
    res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...headers });
    res.end(encoded);
  };
  function finish(id, status, body) {
    const exchange = pending.get(id);
    if (!exchange) return false;
    write(exchange.res, status, body);
    exchange.dispose();
    return true;
  }

  // Один Observable-инстанс на endpoint. share связывает подписки с одним
  // слушателем HTTP; teardown снимает его вместе с последней подпиской.
  const requests = new Observable(subscriber => {
    const onRequest = (req, res) => {
      let url;
      try { url = new URL(req.url, 'http://entropy.local'); }
      catch { write(res, 400, { error: 'invalid_url' }); return; }
      req.resume();
      if (url.pathname !== path) { write(res, 404, { error: 'not_found' }); return; }
      if (req.method !== 'GET') { write(res, 405, { error: 'method_not_allowed' }, { allow: 'GET' }); return; }
      const id = Object.freeze({});
      const onClose = () => pending.get(id)?.dispose();
      const timer = setTimeout(() => finish(id, 504, { error: 'response_timeout' }), timeoutMs);
      timer.unref();
      const dispose = () => {
        clearTimeout(timer);
        pending.delete(id);
        res.off('close', onClose);
      };
      pending.set(id, { res, dispose });
      res.on('close', onClose);
      subscriber.next(request(id, Object.freeze({ url: req.url, method: req.method })));
    };
    server.on('request', onRequest);
    return () => server.off('request', onRequest);
  }).pipe(share());

  function responses(stream) {
    activeSinks += 1;
    const failure = error => {
      lastError = error;
      for (const id of pending.keys()) finish(id, 500, { error: 'graph_failure' });
      void stop().catch(error => { lastError = error; });
    };
    subscriptions.add(stream.subscribe({
      next(value) {
        try {
          if (!value?.[responseBrand]) throw new TypeError('HTTP sink requires Response');
          finish(value[token], value.content.status, value.content.body);
        } catch (error) { failure(error); }
      },
      error: failure,
      complete() {
        activeSinks -= 1;
        // Let RxJS finish upstream teardown before closing the platform host.
        queueMicrotask(() => {
          if (activeSinks === 0) void stop().catch(error => { lastError = error; });
        });
      },
    }));
  }

  async function stop() {
    if (stopPromise) return stopPromise;
    const wasStarting = state === 'starting';
    state = 'stopping';
    stopPromise = (async () => {
      if (wasStarting) { try { await startPromise; } catch { /* bind failed */ } }
      subscriptions.unsubscribe();
      for (const id of pending.keys()) finish(id, 503, { error: 'shutdown' });
      if (server.listening) {
        await new Promise((resolve, reject) => {
          server.close(error => error ? reject(error) : resolve());
          server.closeAllConnections();
        });
      }
      state = 'stopped';
    })();
    return stopPromise;
  }

  function program(activate, signatures) {
    return Object.freeze({
      signatures: Object.freeze(signatures),
      start() {
        if (state === 'starting' || state === 'running') return startPromise;
        if (state !== 'new') return Promise.reject(new Error('Program has stopped; create a new instance'));
        state = 'starting';
        startPromise = Promise.resolve().then(async () => {
          activate();
          if (lastError) throw lastError;
          if (server.listenerCount('request') === 0) throw new Error('Entry did not connect an HTTP source to a sink');
          await new Promise((resolve, reject) => {
            const onError = error => { server.off('listening', onListening); reject(error); };
            const onListening = () => { server.off('error', onError); resolve(); };
            server.once('error', onError);
            server.once('listening', onListening);
            server.listen(port, hostname);
          });
          if (state === 'starting') state = 'running';
          const address = server.address();
          const host = address.address.includes(':') ? `[${address.address}]` : address.address;
          return { url: `http://${host}:${address.port}${path}`, port: address.port };
        }).catch(error => {
          subscriptions.unsubscribe();
          state = 'stopped';
          throw error;
        });
        return startPromise;
      },
      stop,
      inspect: () => ({ state, pending: pending.size, requestListeners: server.listenerCount('request'), error: lastError?.message }),
    });
  }
  return { requests, responses, program };
}
