# Form design guide

## Surface and depth

Build the form on a single matte surface. A gentle top-to-bottom gradient sets the direction of the ambient light. A shallow recess has a narrow shaded upper lip, a lighter lower lip and a flat floor. Keep the label still during a press so the control reads as a surface viewed from above. Use the same light direction in the light and graphite themes.

## Field outline

Align the field label with the page heading and introductory text. In the reference form, the field label is 18 px and the option names are 16 px. Start the upper groove just to the right of the label and follow the rounded right and lower corners. Bring the left wall straight up beneath the label. Align its visible tip, including the rounded cap, with the top edge of the first option’s hit area. The gap below the label lets that alignment remain visible during a press.

## Touch feedback

Pressing anywhere in an enabled radio row starts a soft, lightening ripple at the pointer coordinates. Clip it to the pill-shaped hit area that encloses the indicator and its label. Give every option the same rounded ends and retain an even horizontal inset between the ripple and the field groove. In the dark theme, lower its intensity so that text and the glass remain legible.

The reference interaction expands for 240 ms with `cubic-bezier(.16, 1, .3, 1)`. It stays visible while held. On release, let the expansion finish and fade the wave over 170 ms. Clear it on pointer cancellation. For keyboard activation, use the indicator as the origin. With reduced motion, skip the animated travel. The selected state remains readable after the ripple fades.

## Glass as an accent

Use glass where a small point of attention helps the reader locate the current choice. In the reference radio, a glass disc sits in a shallow socket. A crescent reflection follows the upper rim symmetrically, reaching farther down at the sides and keeping the centre clear. In the light theme, a solid copper ring marks the selected option and matches the 2.5 px focus marks in the groove. In the graphite theme, a continuous warm LED ring follows the inner circumference. Its bright core reflects into the rim of the glass, leaving the centre translucent. The selected label picks up a warm tint in the dark theme.

The reference indicator is about 22 px across. Its entire 64 px-high row accepts input. An unselected option retains its unlit glass. A disabled option shows an empty matte socket. Keep a visible keyboard focus indicator so focus and selection can be identified independently.
