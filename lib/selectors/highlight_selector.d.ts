import Selector from './selector';
import { SelectionState } from '../event_listener';
export default function HighlightSelector({ onTrigger, conditions }: {
    onTrigger?: ((range: Range, e: SelectionState) => void) | undefined;
    conditions?: ((e: SelectionState) => boolean) | undefined;
}): Selector;
