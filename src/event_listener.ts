//Listens to all events from the browser so we can appropriate fire off selectors when needed
import Selector from './selectors/selector'

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

let selectionState: SelectionState = {
    click: false,
    mouseDown: false,
    mouseUp: false,
    mousePosition: false,
    currentKey: false,
    previousKey: false,
    pointerDown: false,
    pointerUp: false,
    pointerPosition: false,
    touchStart: false,
    touchEnd: false,
    touchPosition: false,
    causingEvent: ""
}

let events: {[key: string]: (e: Event) => void} = {
    click: (e: Event) => Object.assign(selectionState, {click: e, causingEvent: 'click'}),
    mousedown: (e: Event) => Object.assign(selectionState, {mouseDown: e, mouseUp: false, mousePosition: e, causingEvent: 'mousedown'}),
    mousemove: (e: Event) => Object.assign(selectionState, {mousePosition: e, causingEvent: 'mousemove'}),
    mouseup: (e: Event) => Object.assign(selectionState, {mouseDown: false, mouseUp: e, mousePosition: e, causingEvent: 'mouseup'}),
    contextmenu: (e: Event) => Object.assign(selectionState, {mouseDown: false, mouseUp: e, causingEvent: 'contextmenu'}),
    pointerdown: (e: Event) => Object.assign(selectionState, {pointerDown: e, pointerUp: false, pointerPosition: e, causingEvent: 'pointerdown'}),
    pointerup: (e: Event) => Object.assign(selectionState, {pointerUp: e, pointerDown: false, pointerPosition: e, causingEvent: 'pointerup'}),
    pointermove: (e: Event) => Object.assign(selectionState, {pointerPosition: e, causingEvent: 'pointermove'}),
    keydown: (e: Event) => Object.assign(selectionState, {currentKey: e, causingEvent: 'keydown'}),
    keyup: (e: Event) => Object.assign(selectionState, {previousKey: e, currentKey: false, causingEvent: 'keyup'}),
    wheel: (e: Event) => Object.assign(selectionState, {wheel: e, causingEvent: 'wheel'}),
    scroll: (e: Event) => Object.assign(selectionState, {scroll: e, causingEvent: 'scroll'}),
    touchstart: (e: Event) => Object.assign(selectionState, {touchStart: e, touchEnd: false, touchPosition: e, causingEvent: 'touchstart'}),
    touchmove: (e: Event) => Object.assign(selectionState, {touchPosition: e, causingEvent: 'touchmove'}),
    touchend: (e: Event) => Object.assign(selectionState, {touchEnd: e, touchStart: false, touchPosition: e, causingEvent: 'touchend'}),
    touchcancel: (e: Event) => Object.assign(selectionState, {touchEnd: e, touchStart: false, touchPosition: e, causingEvent: 'touchcancel'})
}
let currentListeners: {[key: string]: (e: Event) => void} = {}

export default {
    selectors: [] as Selector[],
    enabled: true,
    currentSelector: null as Selector | null,
    init: function(): void {
        Object.keys(events).forEach((eventName): void  => {
            let listener = (e: Event): void => {
                events[eventName](e)
                this.checkConditions()
            }
            window.addEventListener(eventName, listener, true)
            currentListeners[eventName] = listener
        })
    },
    disable: function(): void  {
        this.enabled = false
    },
    enable: function(): void  {
        this.enabled = true
    },
    getSelectionState: function(): SelectionState {
        return selectionState
    },
    teardown: function(): void  {
        Object.keys(currentListeners).forEach((listenerName): void  => {
            window.removeEventListener(listenerName, currentListeners[listenerName])
        })
        currentListeners = {}
    },
    checkConditions: function(): void  {
        if (!this.enabled)
            return

        //If we have a selector currently running, we check and update that first
        if (this.currentSelector) {
            let selector = this.currentSelector
            let isValid = selector.conditions(selectionState)
            if (isValid) {
                if (selector.onSelectionChange)
                    selector.onSelectionChange(selectionState)
                return;
            } else {
                selector.isRunning = false;
                if (selector.onSelectionChange)
                    selector.onSelectionChange(selectionState)
                if (selector.onSelectionEnd)
                    selector.onSelectionEnd(selectionState)
                this.currentSelector = null
            }
        }

        //Finally, if we don't have a current selector, we loop through the available ones
        //finding the first valid one and setting that to our current selection state
        this.selectors.forEach((selector): void  => {
            let isValid = selector.conditions(selectionState)

            if (isValid) {
                selector.isRunning = true;
                this.currentSelector = selector
                if (selector.onSelectionStart)
                    selector.onSelectionStart(selectionState)
                if (selector.onSelectionChange)
                    selector.onSelectionChange(selectionState)
                return
            }
        })
    }
}
