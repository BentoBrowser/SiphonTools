
/*
 * A trigger which involves drawing a box around a section of content
 *
 * options = {
    onTriggerCompletion(range, mouseEvent) //Returns the the current selection range
  }
 */
import ToolbarTrigger from './toolbar_trigger'

export default class Selection extends ToolbarTrigger {
  constructor(options) {
    super(options)
    this.disableForElements = options.disableForElements || ["INPUT", "TEXTAREA"]
  }

  init() {
    var mouseStart;

    window.addEventListener("contextmenu", (e) => {
      mouseStart = null;
    })

    window.addEventListener("mousedown", (e) => {
      if (this.disableForElements.indexOf(e.target.nodeName) < 0 &&
          !e.target.isContentEditable) {
        mouseStart = e;
      }
      return false;
    });

    window.addEventListener("mouseup", (e) => {
      if (!mouseStart)
        return;

      mouseStart = null;
      //Put this in a timeout, because the selection doesn't get cleared until after this event handler
      setTimeout(() => {
        let selection = document.getSelection();
        switch(selection.type) {
          case "Range":
            if (!selection.getRangeAt(0).toString().trim().length)
              return;

            //TODO update positioning when you are at the bounds of the page
            let range = selection.getRangeAt(0);
            this.onTrigger({range: range, event: e})
            break;
          case "Caret":  //TODO allow placing a pin here?
          case "None":
        }
      }, 5);
    });
  }
}
