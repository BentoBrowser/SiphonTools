import {SelectionState} from '../event_listener'

export default interface Selector {
    conditions: (e: SelectionState) => boolean;
    onSelectionStart?: (e: SelectionState) => void;
    onSelectionChange?: (e: SelectionState) => void;
    onSelectionEnd?: (e: SelectionState) => void;
    isRunning?: boolean;
}

//Example Selector
// export default function Selector({...options}) {
//     return {
//         conditions: function(e: SelectionState) {
//             //conditions that need to be true for the selection interaction to begin and continue
//             //Should return a boolean
//         },
//         onSelectionStart: function(e: SelectionState) {
//             //Handler that will fire when the selection begins
//         },
//         onSelectionChange: function(e: SelectionState) {
//             //Fires as new events come in (some may or my not be relevant to the selection)
//         },
//         onSelectionEnd: function(e: SelectionState) {
//             //either cancel the selection
//         }
//     }
// }
