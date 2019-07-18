import Selector from './selector'
import {SelectionState} from '../event_listener'

export default function HighlightSelector({onTrigger = (range: Range, e: SelectionState): void => {},
    conditions = (e: SelectionState): boolean => true}): Selector {
    return {
        conditions: function(e): boolean {
            return e.mouseDown && conditions(e) &&
            // @ts-ignore
            (!e.mouseDown.target || (["INPUT", "TEXTAREA"].indexOf(e.mouseDown.target.nodeName) < 0 && !e.mouseDown.target.isContentEditable))
        },
        onSelectionEnd: function(e): void {
            let selection = document.getSelection();
            if (e.mouseUp && selection) { //We ended the selection because the mouse is now up
                switch(selection.type) {
                    case "Range":
                        if (!selection.getRangeAt(0).toString().trim().length)
                            return;

                        //TODO update positioning when you are at the bounds of the page
                        let range = selection.getRangeAt(0);
                        //Fancy way to place toolbar to the left of the highlight
                        onTrigger(range, e)
                        break;
                    case "Caret":  //TODO allow placing a pin here?
                    case "None":
                }
            }
        }
    }
}
