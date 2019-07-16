export default function HoverElementSelector({ selector = "", otherConditions = () => true, displayOverlay = (el, e) => { }, hideOverlay = (el, e) => { } }) {
    var element = null;
    return {
        conditions: function ({ mousePosition }) {
            if (!mousePosition)
                return false;
            var x = mousePosition.clientX, y = mousePosition.clientY, stack = document.elementsFromPoint(x, y);
            //Search for videos first
            element = stack.find((elem) => elem.matches(selector)) || null;
            return !!element && otherConditions();
        },
        onSelectionStart: function (e) {
            if (element)
                displayOverlay(element, e);
        },
        onSelectionEnd: function (e) {
            if (element)
                hideOverlay(element, e);
            element = null;
        }
    };
}
//# sourceMappingURL=hover_element_selector.js.map