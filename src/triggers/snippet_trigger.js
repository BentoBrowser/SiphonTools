
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

 const styleElem = document.createElement('style');
 document.head.appendChild(styleElem);
 var styleSheet = styleElem.sheet;

export default function SnippetTrigger({onTrigger}) {
  return {conditions: function(e) {
      return e.mousedown && (e.mousedown.getModifierState("Alt") || e.mousedown.getModifierState("Meta"))
    },
    onSelectionStart: function(e) {
      document.body.appendChild(this.captureWindow);
      styleSheet.insertRule('::selection { background-color: inherit  !important; color: inherit  !important;}');
    }
    onSelctionChange: function(e) {
      this.captureWindow.style.width = `${Math.abs(mouseStart.pageX - e.pageX)}px`;
      this.captureWindow.style.height = `${Math.abs(mouseStart.pageY - e.pageY)}px`;

      this.captureWindow.style.top = (e.pageY >= mouseStart.pageY)? `${mouseStart.pageY}px` : `${e.pageY}px`;
      this.captureWindow.style.left = (e.pageX >= mouseStart.pageX)? `${mouseStart.pageX}px` : `${e.pageX}px`;
    },
    onSelectionEnd: function(e) {
      if (e.mousedown) { //In this case we still have the mouse depressed, so we gracefully cancel the selection
        let bounding = this.captureWindow.getBoundingClientRect()
        styleSheet.removeRule(0);
        selection.empty();
        onTrigger(captureWindow, e)
      } else { //Otherwise we consider this a completed selection
        if (styleSheet.cssRules.length > 0) {
          styleSheet.removeRule(0);
        }
        this.captureWindow.remove();
      }
    }
  }
}
