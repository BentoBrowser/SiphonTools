var defaultTrigger = function({currentKey}) {
  return currentKey && currentKey.key == "Shift"
         && ["INPUT", "TEXTAREA"].indexOf(currentKey.target.nodeName) < 0 && !currentKey.target.isContentEditable
}

export default function ElementSelector({trigger = defaultTrigger, onComplete, onUpdate} = {}) {
  var saveElements = []
  var highlightBoxes = []

  var highlightedElement = null
  var highlightBox = null

  return {
    conditions: trigger,
    onSelectionChange: function({mouseDown, mousePosition}) {
      if (mouseDown && highlightedElement) {
        mouseDown.preventDefault()
        mouseDown.stopPropagation()

        //Determine if any of the children are in our list -- if they are remove them
        for (let i = saveElements.length - 1; i >= 0; i--) {
          if (highlightedElement.contains(saveElements[i])) {
            saveElements.splice(i, 1)
            highlightBoxes.splice(i, 1)[0].remove()
          }
        }

        saveElements.push(highlightedElement)
        highlightBoxes.push(highlightBox)
        highlightBox.style.pointerEvents = 'auto'
        highlightBox.style.backgroundColor = '#9af58999'
        highlightBox = null
        highlightedElement = null
        //mouseDown.target.style.border = '2px solid blue'

        if (onUpdate && saveElements.length) {
          onUpdate(saveElements, highlightBoxes)
        }
      } else if (mouseDown && mouseDown.target.className.includes("siphon-element-selector")) {
        mouseDown.preventDefault()
        mouseDown.stopPropagation()

        let boxIdx = highlightBoxes.indexOf(mouseDown.target)
        if (boxIdx >= 0) {
          highlightBoxes.splice(boxIdx, 1)
          saveElements.splice(boxIdx, 1)
          mouseDown.target.remove()

          if (onUpdate && saveElements.length) {
            onUpdate(saveElements, highlightBoxes)
          }
        }
      } else if (highlightedElement != mousePosition.target){
        if (mousePosition && mousePosition.target && !mousePosition.target.className.includes("siphon-element-selector")) {
          if (!highlightedElement) {
            highlightBox = document.body.appendChild(document.createElement('div'));
            highlightBox.style.position = "absolute"
            highlightBox.style.backgroundColor = '#84e2f199'
            highlightBox.style.zIndex = "889944"
            highlightBox.style.pointerEvents = 'none'
            highlightBox.style.pointer = 'pointer'
            highlightBox.className = "siphon-element-selector"
          }
          if (highlightBox) {
            let rect = mousePosition.target.getBoundingClientRect()
            let x = rect.left + window.scrollX,
                y = rect.top + window.scrollY;

            highlightBox.style.left = `${x}px`;
            highlightBox.style.top = `${y}px`;
            highlightBox.style.height = `${rect.height}px`;
            highlightBox.style.width = `${rect.width}px`;
            highlightedElement = mousePosition.target
          }
        } else if (highlightBox) {
          highlightBox.remove()
          highlightedElement = null
        }
      }
    },
    onSelectionEnd: function(e) {
      //either cancel the selection
      if (highlightBox) {
        highlightBox.remove()
        highlightedElement = null
      }

      if (onComplete && saveElements.length)
        onComplete(saveElements, highlightBoxes, e)
    }
  }
}
