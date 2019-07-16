import rangyClassApplier from 'rangy/lib/rangy-classapplier';
import rangyTextRange from 'rangy/lib/rangy-textrange'
import rangy from 'rangy/lib/rangy-core.js';

import SelectionAnnotation, {SelectionSerializedAnnotation} from './selection_annotation'

export default class Highlight extends SelectionAnnotation {

  public markupClass: string
  public classApplier: any

  constructor(range: Range) {
    super(range);
    this.markupClass = 'siphon-highlight';
    this.classApplier = rangy.createClassApplier(this.markupClass, {
      elementTagName: 'span',
      onElementCreate: (el: Element) => {
        el.classList.add(`siphon-annotation-${this.key}`);
      }
    });
  }

  deserialize(serialized: SelectionSerializedAnnotation) {
    super.deserialize(serialized);
    this.markupClass = 'siphon-highlight';
    this.classApplier = rangy.createClassApplier(this.markupClass, {
      elementTagName: 'span',
      onElementCreate: (el: Element) => {
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
