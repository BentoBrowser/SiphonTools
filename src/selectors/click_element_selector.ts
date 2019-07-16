import Selector from './selector'

export default function ClickElementSelector({selector = "", otherConditions = (): boolean => true, onClick = (target: EventTarget, e: Event): void => {}}): Selector {
    return {
        conditions: function({mouseDown}): boolean {
            return mouseDown && mouseDown.target && (mouseDown.target as HTMLElement).matches(selector) && otherConditions() || false
        },
        onSelectionEnd: function({mouseUp}): void {
            if (mouseUp && mouseUp.target && (mouseUp.target as HTMLElement).matches(selector))
                onClick(mouseUp.target, mouseUp)
        }
    }
}
