
export default function ElementSelector({triggerCondition, onComplete} = {}) {
  var saveElements = []
  var prevElement = null
  return {
    conditions: function({keyDown}) {
      return keyDown.key == "Escape"
    },
    onSelectionChange: function({mouseDown, mousePosition}) {
      if (mouseDown) {
        saveElements.push(mouseDown.target)
        mouseDown.target.style.border = '2px solid blue'
      } else if (prevElement != mousePosition.target){
        prevElement.style.border = 'none'
        mousePosition.target.style.border = '1px solid green'
        prevElement = mousePosition.target
      }
    },
    onSelectionEnd: function(e) {
      //either cancel the selection
      if (onComplete)
        onComplete(saveElements, e)
    }
  }
}
