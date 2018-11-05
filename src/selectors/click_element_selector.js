export default function ClickElementSelector({selector, onClick}) {
  return {
    conditions: function({mouseDown}) {
      return mouseDown && mouseDown.target.matches(selector)
    },
    onSelectionEnd: function({mouseUp}) {
      if (mouseUp && mouseUp.target.matches(selector))
        onClick(mouseUp.target, mouseUp)
    }
  }
}
