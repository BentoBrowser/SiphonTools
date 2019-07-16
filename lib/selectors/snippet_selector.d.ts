import Selector from './selector';
import { SelectionState } from '../event_listener';
export default function SnippetSelector({ onTrigger, trigger, onStart, onChange }: {
    onTrigger?: ((captureWindow: HTMLDivElement, e: SelectionState) => void) | undefined;
    trigger?: ((e: SelectionState) => boolean) | undefined;
    onStart?: ((e: SelectionState) => null) | undefined;
    onChange?: ((e: SelectionState) => null) | undefined;
}): Selector;
