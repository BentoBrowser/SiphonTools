
/*
 * A trigger which involves drawing a box around a section of content
 *
 * options = {
    onTriggerCompletion(captureWindow, mouseEvent) //Returns the dom element that was drawn around the content
    shouldTriggerActivate(mouseEvent) // A precondition for the box to be drawn on the page (default to required alt key)
  }
 */

//TODO: Could be interesting? https://github.com/Simonwep/selection

import Selector from './selector'
import {SelectionState} from '../event_listener'

let captureWindow = document.createElement('div');
captureWindow.className = 'siphon-selection-window';

const defaultTrigger = function(e: SelectionState): boolean {
    return e.mousePosition && e.mousePosition.getModifierState("Alt")
    //  || e.mousePosition.getModifierState("Meta") Used to allow meta, but causes issues with new tab interaction
}

let styleElem: HTMLStyleElement;

export default function SnippetSelector({onTrigger = (captureWindow: HTMLDivElement, e: SelectionState) => {},
    trigger = defaultTrigger, onStart = (e: SelectionState) => null, onChange = (e: SelectionState) => null}): Selector {
    return {
        conditions: function(e): boolean {
            return trigger(e) && !!e.mouseDown
        },
        onSelectionStart: function(e): void {
            document.body.appendChild(captureWindow);
            styleElem = document.createElement('style');
            if (!document.head) {
                let htmls = document.getElementsByTagName('html');
                if (htmls && htmls.length) {
                    htmls[0].insertBefore(document.createElement('head'), document.body);
                }
            }
            document.head.appendChild(styleElem);
            var styleSheet = styleElem.sheet;
            if (styleSheet) {
                // @ts-ignore
                styleSheet.insertRule('::selection { background-color: inherit  !important; color: inherit  !important;}');
            }
            onStart(e)
        },
        onSelectionChange: function(e): void {
            let {mouseDown, mousePosition} = e
            if (mouseDown && mousePosition) {
                captureWindow.style.width = `${Math.abs(mouseDown.pageX - mousePosition.pageX)}px`;
                captureWindow.style.height = `${Math.abs(mouseDown.pageY - mousePosition.pageY)}px`;

                captureWindow.style.top = (mousePosition.pageY >= mouseDown.pageY)? `${mouseDown.pageY}px` : `${mousePosition.pageY}px`;
                captureWindow.style.left = (mousePosition.pageX >= mouseDown.pageX)? `${mouseDown.pageX}px` : `${mousePosition.pageX}px`;
            }
            onChange(e)
        },
        onSelectionEnd: function(e): void {
            let selection = document.getSelection();
            if (!e.mouseDown) { //In this case we still have the mouse depressed, so we gracefully cancel the selection
                //let bounding = captureWindow.getBoundingClientRect()
                if (selection)
                    selection.empty();
                onTrigger(captureWindow, e)
            } else { //Otherwise we consider this a completed selection
                captureWindow.remove();
            }
            styleElem.remove()
        }
    }
}
