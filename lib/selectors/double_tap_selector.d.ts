import Selector from './selector';
export default function DoubleTapSelector({ key, afterTap, delta }: {
    key?: string | undefined;
    afterTap?: ((e: KeyboardEvent) => void) | undefined;
    delta?: number | undefined;
}): Selector;
