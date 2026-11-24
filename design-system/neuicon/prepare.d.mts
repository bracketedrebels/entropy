export interface IconPair {
  from: string
  to: string
  size?: number
  /** Total poses including both endpoints. Overrides the catalogue setting. */
  frames?: number
  draw(progress: number): string
}
export interface IconOptions {
  icons?: Readonly<Record<string, string>>
  pairs?: readonly IconPair[]
  /** Total poses in a custom transition, including its endpoints. Default 49. */
  frames?: number
}
interface Rules { [name: string]: string | Rules }
export function prepareIcons(options?: IconOptions): { properties: Record<string, Rules>; utilities: Record<string, Rules> }
