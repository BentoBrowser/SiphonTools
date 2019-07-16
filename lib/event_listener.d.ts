import Selector from './selectors/selector';
export interface SelectionState {
    mouseDown: MouseEvent | false;
    mouseUp: MouseEvent | false;
    click: MouseEvent | false;
    mousePosition: MouseEvent | false;
    currentKey: KeyboardEvent | false;
    previousKey: KeyboardEvent | false;
    pointerDown: PointerEvent | false;
    pointerUp: PointerEvent | false;
    pointerPosition: PointerEvent | false;
    touchStart: TouchEvent | false;
    touchEnd: TouchEvent | false;
    touchPosition: TouchEvent | false;
    causingEvent: string;
}
declare const _default: {
    selectors: Selector[];
    enabled: boolean;
    currentSelector: Selector | null;
    init: () => void;
    disable: () => void;
    enable: () => void;
    getSelectionState: () => SelectionState;
    teardown: () => void;
    checkConditions: () => void;
};
export default _default;
