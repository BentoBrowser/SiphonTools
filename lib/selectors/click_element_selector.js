export default function ClickElementSelector({ selector = "", otherConditions = () => true, onClick = (target, e) => { } }) {
    return {
        conditions: function ({ mouseDown }) {
            return mouseDown && mouseDown.target && mouseDown.target.matches(selector) && otherConditions() || false;
        },
        onSelectionEnd: function ({ mouseUp }) {
            if (mouseUp && mouseUp.target && mouseUp.target.matches(selector))
                onClick(mouseUp.target, mouseUp);
        }
    };
}
//# sourceMappingURL=click_element_selector.js.map