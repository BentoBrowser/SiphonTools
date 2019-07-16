import Selector from './selector';
export default function ClickElementSelector({ selector, otherConditions, onClick }: {
    selector?: string | undefined;
    otherConditions?: (() => boolean) | undefined;
    onClick?: ((target: EventTarget, e: Event) => void) | undefined;
}): Selector;
