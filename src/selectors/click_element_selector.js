export default function ClickElementSelector({selector, otherConditions = () => true, onClick}) {
  return {
    conditions: function({mouseDown}) {
      return mouseDown && mouseDown.target.matches(selector) && otherConditions()
    },
    onSelectionEnd: function({mouseUp}) {
      if (mouseUp && mouseUp.target.matches(selector))
        onClick(mouseUp.target, mouseUp)
    }
  }
}
