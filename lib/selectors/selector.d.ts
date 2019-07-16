import { SelectionState } from '../event_listener';
export default interface Selector {
    conditions: (e: SelectionState) => boolean;
    onSelectionStart?: (e: SelectionState) => void;
    onSelectionChange?: (e: SelectionState) => void;
    onSelectionEnd?: (e: SelectionState) => void;
    isRunning?: boolean;
}
