import Trigger from './trigger'

export default class ToolbarTrigger extends Trigger{
  constructor(options) {
    this.onTriggerStart = options.onTriggerStart || () => {}
    this.onTriggerEnd = options.onTriggerEnd || () => {}
  }

  init(prevTrigger) {
    const toolbar = document.body.appendChild(document.createElement('div'));
    toolbar.className = 'siphon-toolbar-container';


  }

  setToolbarForRange(range, e) {
    let container = range.commonAncestorContainer;
    if (container.nodeType != 1) { //If we have non html elems
      container = container.parentElement;
    }

    let style = window.getComputedStyle(container);
    while(style.display.indexOf("inline") >= 0) {
        container = container.parentElement;
        style = window.getComputedStyle(container);
    }


    let x = range.getBoundingClientRect().left + window.scrollX,
        y = range.getBoundingClientRect().top + window.scrollY,
        horizontal = (x - toolbarWidth) < 0;

    y = (range.getBoundingClientRect().height >= toolbarHeight)?
         y : y - ((toolbarHeight - range.getBoundingClientRect().height) / 2 )
    x = (horizontal)? Math.max(5, e.pageX - toolbarHeight) : x - toolbarWidth
    y = (horizontal)? e.pageY + 14 : y

    toolbar.style.left = `${x}px`;
    toolbar.style.top = `${y}px`;

    return horizontal
  }
}
