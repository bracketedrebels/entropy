import { prepareBehavior } from '../prepareBehavior'
import { attachRipple } from './attachRipple'

export const useRipple = prepareBehavior(attachRipple)
