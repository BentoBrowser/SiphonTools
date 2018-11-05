export default function DoubleTapSelector({key, afterTap, delta = 500}) {
  let lastKeypressTime = 0

  return {
    conditions: function({previousKey}) {
      return previousKey.key == key
    },
    onSelectionStart: function({previousKey}) {
      var thisKeypressTime = new Date();
      lastKeypressTime = thisKeypressTime;
    },
    onSelectionEnd: function({previousKey}) {
      var thisKeypressTime = new Date();
      if (previousKey.key == key && thisKeypressTime - lastKeypressTime <= delta) {
        afterTap(previousKey)
      }
      lastKeypressTime = 0
    }
  }
}
