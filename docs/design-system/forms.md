# Form design guide

The Trinet notification form is the reference for this guide. Its fields answer three different questions at a glance. What value have I chosen? Where am I working? What can I do here next? The same answers should remain legible as a field grows from one line to a full screen. [Try the reference form](https://trinet-radio-touch.dewyfrog69.chatgpt.site/?locale=ru-RU).

## 1. One value occupies one region of the surface

Give one editable value one **field**, one label and one enclosing groove (**ridge**). “Куда доставлять сводку?” owns a set of destinations. Its six rows, its summary and its expand action all belong inside that boundary. Text entry and date selection use the same boundary even though their contents differ.

The controls sit on a matte surface viewed from directly above. Ambient light falls from the top. A shallow cut has a narrow shaded upper lip, a lighter lower lip and a flat floor. A gentle vertical gradient is one surface treatment. The groove must also read over a different underlying material. Keep text on its baseline throughout a press. In the reference form, Ubuntu Light, a slightly larger field label and quieter descriptions establish the reading order.

## 2. The groove follows its contents

Align the label with the surrounding page text. The upper groove leaves the end of the label at its baseline and rounds the upper-right corner. The left wall ends beneath the label, level with the top of the first hit area. A wrapped label gets its full height before the first row begins.

Choose each corner from the shape beside it. Where a groove surrounds the rounded end of a row, their arcs share a centre. Where a smaller capsule occupies the lower-right corner, that corner takes the capsule radius plus the gap. The lower-left corner can keep its larger radius. Look for an even strip of surface along the straight edge, around the turn and underneath.

## 3. Press, focus and selection each have a visible signal

| Signal | What the user sees | How long it lasts |
| --- | --- | --- |
| Press | A soft lightening ripple starts under the finger and spreads to the rounded bounds of the hit area. The whole option row responds, including its label. | Appears on contact and holds under the finger. On release the wave finishes and fades. Cancellation clears it. |
| Focus | Two short accents in the side grooves sit opposite the active row. In a multiline editor they track the visual line of the caret, including soft wraps. | Follows the current place of work. |
| Selection | A small recessed point marks a single choice. A square marks membership in a multiple choice. | Persists when focus moves elsewhere and after the ripple fades. |

In graphite, selection has a hot white core and a warm halo. Focus looks like light seen through a slit from beneath the surface. It stays inside the groove even around a moving corner. In the light theme, selection is solid copper and focus is a short copper stroke. Both themes use the same locations and shapes. The reference focus band is one option high in graphite and 24 px high in light. Its centre tracks the caret independently of the font size.

For keyboard activation, the ripple starts at the indicator. Keep the marker small and the hit area generous. The gap from the groove to the marker matches the gap from the marker to the text. The everyday selection mark is a point or square up to 8 px across. Reserve a separate material such as glass for a deliberate point of emphasis. Disabled rows keep a readable value and a subdued mark. Keyboard users can locate focus independently of the saved value.

## 4. Expansion makes room and preserves orientation

Reveal choices, search and assistants in the reading flow. The next field moves down as the current one opens. The press registers immediately, then the movement slows towards its end. The reference ripple expands in about 240 ms and fades over roughly 170 ms. With reduced motion, the control still acknowledges the action and exposes the resulting state.

Use one vertical scroll for the form and its open choices. On expansion, move the page just far enough to show the whole field if it fits. For a taller field, stop when its top reaches the top of the available viewport. The user takes the next scroll.

Keep the label and upper arc together at the top. Keep the lower arc and its actions together at the bottom. As the field leaves view, shorten the straight sides. Once the arcs meet, the remaining shape travels out as a unit. During a fast reversal, text stays inside the opening, the arcs meet the walls cleanly and the lamp stays in its groove.

## 5. A collapsed field still tells you its value

The short and long multiselect use the same sequence. Open the field, edit the selection in place, then collapse it. Keep rows in place while the user checks them. On the next opening, put the current selection first and append the available choices below.

Show one or two selected rows in full. From three selections onwards, show the first and summarise the rest. With four selections from 144 projects, show the first row and one capsule reading **«Ещё 3 из 144 вариантов»**. The 3 counts the hidden selections. The 144 counts every available project. With an empty selection, show an invitation to choose. On opening, the capsule shows the total and the chevron turns up.

Scale the assistance with the task. Six destinations fit a short list. Above six options, the reference adds search beneath the sticky label. Filtering preserves the selection. Clearing restores the list and keeps the cursor in search. The scroll and the bottom action work the same way for 144 projects as for six destinations.

## 6. The lower-right corner belongs to field metadata and actions

Put the primary capsule at the lower right, within reach of the thumb. Additional capsules fill the row towards the left and wrap above it. Reserve room for the visible rows. Give that space back to the value when the last capsule disappears.

A capsule with a chevron is one target across its entire width. It describes the list and toggles it. A status capsule simply reports a value and is skipped by keyboard navigation. For example, **«Осталось 50 символов»** appears as the limit approaches, becomes redder towards zero and keeps the count readable at every urgency level. Both kinds share the same alignment and corner geometry.

## 7. Editing preserves the position of the work

- **Text.** A single line reads as an ordinary input. The field grows as text wraps. The first line starts in the common text column after its icon. Subsequent lines start at the icon’s left edge, reclaiming width on a phone.
- **Tags.** Enter places the new tag in the first row beneath the input and moves earlier tags down. Tags are user-entered values, so they stay in the body of the field. A tap selects the tag. Dragging right reveals «Удалить» on the left, where the finger leaves it visible. Releasing before the word is fully revealed cancels deletion. Releasing after the threshold confirms it. The tag icon becomes a bin as the action is revealed. A first-touch hint demonstrates a partial swipe, returns and can be dismissed. From the start of the input, Backspace first focuses a tag, so the user can identify it before deleting it with the keyboard.
- **Date.** Day, month and year can each open their own assistant. The locale determines segment order, separators and the first weekday. Choosing a year leads to months, then to days. Moving from one grid to the next makes the change of scale visible. Year pages slide horizontally, with later years to the right in the reference’s left-to-right layout. After day selection or ordinary scrolling the assistant stays open until the user collapses it. Time can be a separate field.

## Applying the principles to the graph

The form establishes the interaction language. The graph editor is the next place to test it. Consider a node with a selected input while keyboard focus moves to a port. Can a reader still identify the node, the saved choice, the focused port and the existing connection? A groove already denotes a boundary and a lamp denotes focus. A connection needs to remain recognisable when the lamp moves.

A second trial is to open a node’s settings near the edge of the canvas. Check whether its title, ports and connected edges remain traceable as details appear, and whether the user can collapse it from where they finished editing. The graph prototype should settle how neighbours move and how connections are drawn.

## React components

The component kit includes Row, Reveal, Ridge, Pill and Field. The React notification settings story composes ten reference fields, including the dependent email editor and linked single- and multiple-project pickers. The date assistant and swipeable tags remain in the reference prototype. [Component API and Storybook setup](../../design-system/README.md)

## Implementing the patterns

The application owns the elements, their semantics and their order. Publish layout and material as CSS. Mark row children with named grid areas. A metadata capsule can be a native button or an output with the same class. Attach interaction to those elements through a hook when it needs event coordinates, focus management or measurement. A hook factory can capture static options once outside rendering. Each mounted instance owns its listeners and cleanup.

Publish compound structures such as the ridge as editable recipes. Their sticky tracks, drawing surface and content regions belong to the consuming markup. Keep the choice of renderer independent of the field’s value and accessible name. [CSS API, hooks and recipes](../../design-system/README.md)
