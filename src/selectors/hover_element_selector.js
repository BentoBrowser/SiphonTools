export default function HoverElementSelector({selector, displayOverlay, hideOverlay}) {
  var element = null
  return {
    conditions: function({mousePosition}) {
      if (!mousePosition)
        return

      var x = mousePosition.clientX,
      y = mousePosition.clientY,
      stack = document.elementsFromPoint(x,y)
      //Search for videos first
      element = stack.find(elem => elem.matches(selector))
      return !!element
    },
    onSelectionStart: function(e) {
      displayOverlay(element, e)
    },
    onSelectionEnd: function(e) {
      hideOverlay(element, e)
      element = null
    }
  }
}
