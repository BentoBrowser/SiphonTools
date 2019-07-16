import Selector from './selector'

export default function DoubleTapSelector({key = "", afterTap = (e: KeyboardEvent): void => {}, delta = 500}): Selector {
    let lastKeypressTime = 0

    return {
        conditions: function({previousKey}): boolean {
            return previousKey && previousKey.key == key
        },
        onSelectionStart: function(): void {
            var thisKeypressTime = Date.now();
            lastKeypressTime = thisKeypressTime;
        },
        onSelectionEnd: function({previousKey}): void {
            var thisKeypressTime = Date.now();
            if (previousKey && previousKey.key == key && thisKeypressTime - lastKeypressTime <= delta) {
                afterTap(previousKey)
            }
            lastKeypressTime = 0
        }
    }
}
