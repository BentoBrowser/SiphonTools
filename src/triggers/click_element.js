

let klass = e.target.className;
if (klass && klass.match && klass.match(/siphon-highlight/)) {
  let id = e.target.className.split("siphon-highlight_")[1];
  let highlight = store.highlights[id];
  let horizontal = false
  if (highlight.range)
    horizontal = setToolbarForRange(highlight.range.nativeRange, e);
  else {
    toolbar.style.left = `${e.pageX+10}px`;
    toolbar.style.top = `${e.pageY+10}px`;
  }
  ReactDOM.render(<AnnotationToolbar highlight={highlight} store={store} horizontal={horizontal}/>, toolbar)
  return false;
}

if (klass && klass.match && klass.match(/siphon-snippet/)) {
  let id = e.target.className.split("siphon-snippet_")[1];
  let highlight = store.highlights[id];

  let rect = highlight.nodes[0].getBoundingClientRect();
  let x = rect.left + window.scrollX,
      y = rect.top + window.scrollY;
  toolbar.style.left = `${x - toolbarWidth}px`;
  toolbar.style.top = `${y}px`;
  ReactDOM.render(<AnnotationToolbar highlight={highlight} store={store}/>, toolbar)
}
