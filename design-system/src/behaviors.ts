import { prepareBehavior } from './prepareBehavior'
import { attachRidge } from './ridge/geometry'

export { prepareBehavior }
export { useReveal, useRevealGroup } from './reveal/useReveal'
export { useFocusAnchor } from './ridge/focus'
export const useRidge = prepareBehavior(attachRidge)
