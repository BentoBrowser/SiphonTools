import { SelectionState } from '../event_listener';
import Selector from './selector';
export default function ElementSelector({ trigger, onComplete, onUpdate, ignoreElements }?: {
    trigger?: (({ currentKey }: SelectionState) => boolean) | undefined;
    onComplete: any;
    onUpdate: any;
    ignoreElements: any;
}): Selector;
