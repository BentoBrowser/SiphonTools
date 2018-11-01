import rangyClassApplier from 'rangy/lib/rangy-classapplier';
import rangyTextRange from 'rangy/lib/rangy-textrange'
import rangy from 'rangy/lib/rangy-core.js';

import SelectionAnnotation from './selection_annotation'

export default class Highlight extends SelectionAnnotation {

  constructor(range) {
    super(range);
    this.markupClass = `siphon-highlight_${this.key}`;
    this.classApplier = rangy.createClassApplier(this.markupClass, {elementTagName: 'mark'});
  }

  deserialize(serialized) {
    super.deserialize(serialized);
    this.selection = annoObject.selection;
    this.markupClass = `siphon-highlight_${this.key}`;
    this.classApplier = rangy.createClassApplier(this.markupClass, {elementTagName: 'mark'});
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
