import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-textrange'
// @ts-ignore
import rangy from 'rangy/lib/rangy-core.js';

import SelectionAnnotation, {SelectionSerializedAnnotation} from './selection_annotation'

export default class Highlight extends SelectionAnnotation {

    public markupClass: string
    public classApplier: any

    public constructor(range: Range) {
        super(range);
        this.markupClass = 'siphon-highlight';
        this.classApplier = rangy.createClassApplier(this.markupClass, {
            elementTagName: 'span',
            onElementCreate: (el: Element): void => {
                el.classList.add(`siphon-annotation-${this.key}`);
            }
        });
    }

    public deserialize(serialized: SelectionSerializedAnnotation): void {
        super.deserialize(serialized);
        this.markupClass = 'siphon-highlight';
        this.classApplier = rangy.createClassApplier(this.markupClass, {
            elementTagName: 'span',
            onElementCreate: (el: Element): void => {
                el.classList.add(`siphon-annotation-${this.key}`);
            }
        });
    }

    public mark(): void {
        if (this.range) {
            this.classApplier.applyToRange(this.range);
            this.found = true;
        }
    }

    public unmark(): void {
        if (this.range) {
            this.classApplier.undoToRange(this.range);
        }
    }
}
