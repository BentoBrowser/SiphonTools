

export default class Trigger {
  constructor(options) {
    this.onTriggerEnd = options.onTriggerEnd || () => {}
  }

  init() {
  }
}

let klass = e.target.className;
if (klass && klass.match && (klass.match(/siphon-highlight/) || klass.match(/siphon-snippet/))) {
  let id = e.target.className.split("_")[1];
  let highlight = store.highlights[id];
  let note = store.highlights[id];
  if (note && note.comments) {
    notePopover.style.left = `${e.pageX+5}px`;
    notePopover.style.top = `${e.pageY+5}px`;
    ReactDOM.render(<NotePopover note={note}/>, notePopover)
  }
  return false;
} else {
  ReactDOM.unmountComponentAtNode(notePopover);
}

//IMG overlay code
window.addEventListener("mouseover", e => {
  var x = e.clientX,
  y = e.clientY,
  stack = document.elementsFromPoint(x,y)
  //Search for videos first
  var elem = stack.find(elem => elem.tagName == "VIDEO")
  if (!elem) { //Then search for images
    elem = stack.find(elem => elem.tagName == "IMG")
  }
  if (elem) {
    let rect = elem.getBoundingClientRect();
    if (rect.width < 70 && rect.height < 70)
      return

    let x = rect.left + window.scrollX + 10,
        y = rect.top + window.scrollY + 10;

    imgButtonOverlay.style.display = "block"
    imgButtonOverlay.style.left = `${x}px`;
    imgButtonOverlay.style.top = `${y}px`;
    hoveredImg = elem
  } else {
    imgButtonOverlay.style.display = "none"
    hoveredImg = null;
  }
})

imgButtonOverlay.addEventListener("click", e => {
  e.preventDefault()
  e.stopPropagation()

  if (hoveredImg) {
    store.getNewId().then(key => {
      if (hoveredImg.tagName == "IMG") {
        let highlight = HighlightHelper.createNoteFromImage(key, hoveredImg);
        store.highlights[highlight.key] = highlight;
        setTimeout(() => {
          store.saveAnnotation(highlight);
          message.success("Saved Image!");
        }, 30)
      } else if (hoveredImg.tagName == "VIDEO") {
        let highlight = HighlightHelper.createNoteFromVideo(key, hoveredImg);
        store.highlights[highlight.key] = highlight;
        setTimeout(() => {
          store.saveAnnotation(highlight);
          message.success("Saved Video!");
        }, 30)
      }
    })
  }
})
