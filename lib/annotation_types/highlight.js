import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-textrange';
// @ts-ignore
import rangy from 'rangy/lib/rangy-core.js';
import SelectionAnnotation from './selection_annotation';
export default class Highlight extends SelectionAnnotation {
    constructor(range) {
        super(range);
        this.markupClass = 'siphon-highlight';
        this.classApplier = rangy.createClassApplier(this.markupClass, {
            elementTagName: 'span',
            onElementCreate: (el) => {
                el.classList.add(`siphon-annotation-${this.key}`);
            }
        });
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.markupClass = 'siphon-highlight';
        this.classApplier = rangy.createClassApplier(this.markupClass, {
            elementTagName: 'span',
            onElementCreate: (el) => {
                el.classList.add(`siphon-annotation-${this.key}`);
            }
        });
    }
    mark() {
        if (this.range) {
            this.classApplier.applyToRange(this.range);
            this.found = true;
        }
    }
    unmark() {
        if (this.range) {
            this.classApplier.undoToRange(this.range);
        }
    }
}
//# sourceMappingURL=highlight.js.map