import { channels } from './options'

export type DeliveryStep = { id: string; channel: string }
const defaultChannels = ['mobile', 'email', 'mobile']

export function loadDeliverySteps(value: unknown): DeliveryStep[] {
  const values = Array.isArray(value) ? value : defaultChannels
  return values.filter((key): key is string => channels.some(([id]) => id === key))
    .map((channel, index) => ({ id: 'saved-' + index, channel }))
}

// Application policy for this field. The CSS utilities never interpret typed input.
export const interval = { min: 2, max: 30, step: 2, initial: 10 }

export function retryMinutes(text: string): number | undefined {
  if (!/^[+-]?\d+(?:[.,]\d+)?$/.test(text.trim())) return undefined
  const value = Number(text.trim().replace(',', '.'))
  if (!Number.isInteger(value) || value < interval.min || value > interval.max ||
      (value - interval.min) % interval.step !== 0) return undefined
  return value
}
