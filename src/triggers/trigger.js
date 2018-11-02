
export default function Trigger({...options})
  return {
    conditions: function(e) {
      //conditions that need to be true for the selection interaction to begin and continue
      //Should return a boolean
    },
    onSelectionStart: function(e) {
      //Handler that will fire when the selection begins
    }
    onSelectionChange: function(e) {
      //Fires as new events come in (some may or my not be relevant to the selection)
    },
    onSelectionEnd: function(e) {
      //either cancel the selection
    }
  }
}
