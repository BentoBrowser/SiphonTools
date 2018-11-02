export default function DoubleTapTrigger(key, afterTap, {
  delta = 500
}) {
  return {
    let lastKeypressTime = 0
    conditions: function({keyup}) {
      return keyup.key == key
    },
    onSelectionStart: function({keyup}) {
      var thisKeypressTime = new Date();
      lastKeypressTime = thisKeypressTime;
    },
    onSelectionEnd: function({keyup}) {
      var thisKeypressTime = new Date();
      if (keyup.key == key && thisKeypressTime - lastKeypressTime <= delta) {
        afterTap()
      }
      lastKeypressTime = 0
    }
  }
}
