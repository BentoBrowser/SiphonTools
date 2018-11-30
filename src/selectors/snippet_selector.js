
/*
 * A trigger which involves drawing a box around a section of content
 *
 * options = {
    onTriggerCompletion(captureWindow, mouseEvent) //Returns the dom element that was drawn around the content
    shouldTriggerActivate(mouseEvent) // A precondition for the box to be drawn on the page (default to required alt key)
  }
 */

 //TODO: Could be interesting? https://github.com/Simonwep/selection

 let captureWindow = document.createElement('div');
 captureWindow.className = 'siphon-selection-window';

 const styleElem = document.createElement('style');
 document.head.appendChild(styleElem);
 var styleSheet = styleElem.sheet;

const defaultTrigger = function(e) {
  return e.mousePosition.getModifierState("Alt")
   //  || e.mousePosition.getModifierState("Meta") Used to allow meta, but causes issues with new tab interaction
}

export default function SnippetSelector({onTrigger, trigger = defaultTrigger}) {
  return {
    conditions: function(e) {
      return trigger(e) && e.mouseDown
    },
    onSelectionStart: function(e) {
      document.body.appendChild(captureWindow);
      styleSheet.insertRule('::selection { background-color: inherit  !important; color: inherit  !important;}');
    },
    onSelectionChange: function({mouseDown, mousePosition}) {
      captureWindow.style.width = `${Math.abs(mouseDown.pageX - mousePosition.pageX)}px`;
      captureWindow.style.height = `${Math.abs(mouseDown.pageY - mousePosition.pageY)}px`;

      captureWindow.style.top = (mousePosition.pageY >= mouseDown.pageY)? `${mouseDown.pageY}px` : `${mousePosition.pageY}px`;
      captureWindow.style.left = (mousePosition.pageX >= mouseDown.pageX)? `${mouseDown.pageX}px` : `${mousePosition.pageX}px`;
    },
    onSelectionEnd: function(e) {
      let selection = document.getSelection();
      if (!e.mouseDown) { //In this case we still have the mouse depressed, so we gracefully cancel the selection
        let bounding = captureWindow.getBoundingClientRect()
        styleSheet.removeRule(0);
        selection.empty();
        onTrigger(captureWindow, e)
      } else { //Otherwise we consider this a completed selection
        styleSheet.removeRule(0);
        captureWindow.remove();
      }
    }
  }
}
