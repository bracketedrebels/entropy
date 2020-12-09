export default (points: [number, number][]) => points.reduce((acc: [[number, number], [number, number]], [x, y]: [number, number]) => {
  const [tl, br] = acc;
  const newtl: [number, number] = x < tl[0] ? y < tl[1] ? [x, y] : [x, tl[1]] : y < tl[1] ? [tl[0], y] : tl;
  const newbr: [number, number] = x > br[0] ? y > br[1] ? [x, y] : [x, br[1]] : y > br[1] ? [br[0], y] : br;
  console.log(x, y, newtl, newbr);
  return newtl !== tl || newbr !== br ? [newtl, newbr] : acc;
}, [[0, 0], [0, 0]]) as [[number, number], [number, number]];