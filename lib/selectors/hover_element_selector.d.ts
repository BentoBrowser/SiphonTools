import Selector from './selector';
import { SelectionState } from '../event_listener';
export default function HoverElementSelector({ selector, otherConditions, displayOverlay, hideOverlay }: {
    selector?: string | undefined;
    otherConditions?: (() => boolean) | undefined;
    displayOverlay?: ((el: Element, e: SelectionState) => void) | undefined;
    hideOverlay?: ((el: Element, e: SelectionState) => void) | undefined;
}): Selector;
