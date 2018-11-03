export default function DoubleTapTrigger({key, afterTap, delta = 500}) {
  let lastKeypressTime = 0

  return {
    conditions: function({keyUp}) {
      return keyUp.key == key
    },
    onSelectionStart: function({keyUp}) {
      var thisKeypressTime = new Date();
      lastKeypressTime = thisKeypressTime;
    },
    onSelectionEnd: function({keyUp}) {
      var thisKeypressTime = new Date();
      if (keyUp.key == key && thisKeypressTime - lastKeypressTime <= delta) {
        afterTap(keyUp)
      }
      lastKeypressTime = 0
    }
  }
}
