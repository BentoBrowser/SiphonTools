export default function HoverElementTrigger({selector, displayOverlay, hideOverlay}) {
  var element = null
  return {
    conditions: function({mousemove}) {
      if !mousemove return

      var x = mousemove.clientX,
      y = mousemove.clientY,
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
