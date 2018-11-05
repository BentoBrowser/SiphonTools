export default function HighlightSelector({onTrigger}) {
  return {
    conditions: function({mouseDown}) {
      return mouseDown && !(mouseDown.getModifierState("Alt") || mouseDown.getModifierState("Meta")) &&
      ["INPUT", "TEXTAREA"].indexOf(mouseDown.target.nodeName) < 0 && !mouseDown.target.isContentEditable
    },
    onSelectionEnd: function(e) {
      let selection = document.getSelection();
      if (e.mouseUp) { //We ended the selection because the mouse is now up
        switch(selection.type) {
          case "Range":
            if (!selection.getRangeAt(0).toString().trim().length)
              return;

            //TODO update positioning when you are at the bounds of the page
            let range = selection.getRangeAt(0);
            //Fancy way to place toolbar to the left of the highlight
            onTrigger(range, e)
            break;
          case "Caret":  //TODO allow placing a pin here?
          case "None":
        }
      }
    }
  }
}
