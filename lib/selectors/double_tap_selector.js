export default function DoubleTapSelector({ key = "", afterTap = (e) => { }, delta = 500 }) {
    let lastKeypressTime = 0;
    return {
        conditions: function ({ previousKey }) {
            return previousKey && previousKey.key == key;
        },
        onSelectionStart: function () {
            var thisKeypressTime = Date.now();
            lastKeypressTime = thisKeypressTime;
        },
        onSelectionEnd: function ({ previousKey }) {
            var thisKeypressTime = Date.now();
            if (previousKey && previousKey.key == key && thisKeypressTime - lastKeypressTime <= delta) {
                afterTap(previousKey);
            }
            lastKeypressTime = 0;
        }
    };
}
//# sourceMappingURL=double_tap_selector.js.map