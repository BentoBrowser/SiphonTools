import Selector from './selector'
import {SelectionState} from '../event_listener'

export default function HoverElementSelector({selector = "", otherConditions = () => true,
    displayOverlay = (el: Element, e: SelectionState) => {}, hideOverlay = (el: Element, e: SelectionState) => {}}): Selector {
    var element: Element | null = null
    return {
        conditions: function({mousePosition}): boolean {
            if (!mousePosition)
                return false

            var x = mousePosition.clientX,
                y = mousePosition.clientY,
                stack = document.elementsFromPoint(x,y)
            //Search for videos first
            element = stack.find((elem): boolean => elem.matches(selector)) || null
            return !!element && otherConditions()
        },
        onSelectionStart: function(e): void {
            if (element)
                displayOverlay(element, e)
        },
        onSelectionEnd: function(e): void {
            if (element)
                hideOverlay(element, e)
            element = null
        }
    }
}
