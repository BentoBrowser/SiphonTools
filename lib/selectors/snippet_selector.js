/*
 * A trigger which involves drawing a box around a section of content
 *
 * options = {
    onTriggerCompletion(captureWindow, mouseEvent) //Returns the dom element that was drawn around the content
    shouldTriggerActivate(mouseEvent) // A precondition for the box to be drawn on the page (default to required alt key)
  }
 */
let captureWindow = document.createElement('div');
captureWindow.className = 'siphon-selection-window';
const defaultTrigger = function (e) {
    return e.mousePosition && e.mousePosition.getModifierState("Alt");
    //  || e.mousePosition.getModifierState("Meta") Used to allow meta, but causes issues with new tab interaction
};
let styleElem;
export default function SnippetSelector({ onTrigger = (captureWindow, e) => { }, trigger = defaultTrigger, onStart = (e) => null, onChange = (e) => null }) {
    return {
        conditions: function (e) {
            return trigger(e) && !!e.mouseDown;
        },
        onSelectionStart: function (e) {
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
            onStart(e);
        },
        onSelectionChange: function (e) {
            let { mouseDown, mousePosition } = e;
            if (mouseDown && mousePosition) {
                captureWindow.style.width = `${Math.abs(mouseDown.pageX - mousePosition.pageX)}px`;
                captureWindow.style.height = `${Math.abs(mouseDown.pageY - mousePosition.pageY)}px`;
                captureWindow.style.top = (mousePosition.pageY >= mouseDown.pageY) ? `${mouseDown.pageY}px` : `${mousePosition.pageY}px`;
                captureWindow.style.left = (mousePosition.pageX >= mouseDown.pageX) ? `${mouseDown.pageX}px` : `${mousePosition.pageX}px`;
            }
            onChange(e);
        },
        onSelectionEnd: function (e) {
            let selection = document.getSelection();
            if (!e.mouseDown) { //In this case we still have the mouse depressed, so we gracefully cancel the selection
                //let bounding = captureWindow.getBoundingClientRect()
                if (selection)
                    selection.empty();
                onTrigger(captureWindow, e);
            }
            else { //Otherwise we consider this a completed selection
                captureWindow.remove();
            }
            styleElem.remove();
        }
    };
}
//# sourceMappingURL=snippet_selector.js.map