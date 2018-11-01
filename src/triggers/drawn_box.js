
/*
 * A trigger which involves drawing a box around a section of content
 *
 * options = {
    onTriggerCompletion(captureWindow, mouseEvent) //Returns the dom element that was drawn around the content
    shouldTriggerActivate(mouseEvent) // A precondition for the box to be drawn on the page (default to required alt key)
  }
 */

import ToolbarTrigger from './toolbar_trigger'

export default class DrawnBox extends ToolbarTrigger {
  constructor(options) {
    super(options)
    this.shouldTriggerActivate = options.shouldTriggerActivate || (e) => {
      return e.getModifierState("Alt") || e.getModifierState("Meta")
    }
    this.captureWindowClass = options.captureWindowClass || 'siphon-selection-window'
    this.enableSelection = options.enableSelection || false
  }

  init(prevTrigger) {
    var mouseStart = null;
    this.captureWindow = document.createElement('div');
    captureWindow.className = this.captureWindowClass;

    const styleElem = document.createElement('style');
    document.head.appendChild(styleElem);
    var styleSheet = styleElem.sheet;

    window.addEventListener("contextmenu", (e) => {
      mouseStart = null;
      clearTimeout(longPress); //Remove long press timeout
    })

    window.addEventListener("mousedown", (e) => {
      this.captureWindow.remove();
      mouseStart = e;
      return false;
    });

    window.addEventListener("mousemove", (e) => {
      if (!mouseStart) //Only bother doing anything if we have a mousedown event
        return;

      if (this.shouldTriggerActivate(e)) {
        if (this.captureWindow.parentElement == null && !this.enableSelection) { //Check if the capture window is in the dom, add if not
          document.body.appendChild(this.captureWindow);
          styleSheet.insertRule('::selection { background-color: inherit  !important; color: inherit  !important;}');
        }
      } else { //Otherwise, default to normal selection mode
        if (this.captureWindow.parentElement) { //Check if the capture window is in the dom
          if (styleSheet.cssRules.length > 0) {
            styleSheet.removeRule(0);
          }
          this.captureWindow.remove();
        }
      }

      if (this.captureWindow.parentElement != null) {
        this.captureWindow.style.width = `${Math.abs(mouseStart.pageX - e.pageX)}px`;
        this.captureWindow.style.height = `${Math.abs(mouseStart.pageY - e.pageY)}px`;

        this.captureWindow.style.top = (e.pageY >= mouseStart.pageY)? `${mouseStart.pageY}px` : `${e.pageY}px`;
        this.captureWindow.style.left = (e.pageX >= mouseStart.pageX)? `${mouseStart.pageX}px` : `${e.pageX}px`;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!mouseStart)
        return;

      mouseStart = null;
      //Put this in a timeout, because the selection doesn't get cleared until after this event handler
      setTimeout(() => {
        let selection = document.getSelection();
        if (this.captureWindow.parentElement) {
          let bounding = this.captureWindow.getBoundingClientRect()
          this.onTrigger({rect: bounding, window: this.captureWindow, event: e})
          styleSheet.removeRule(0);
          selection.empty();
        }
      }, 5);
    });
  }

  onTriggerChainComplete() {
    this.captureWindow.remove()
  }

}
