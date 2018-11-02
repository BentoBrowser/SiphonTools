export default function ClickElementTrigger(elementSelector, onClick) {
  return {
    conditions: function({mousedown}) {
      return mousedown && mousedown.target.match(elementSelector)
    },
    onSelectionEnd: function({mouseup}) {
      if (mouseup && mouseup.target.match(elementSelector))
        onClick(mouseup.target, e)
    }
  }
}
