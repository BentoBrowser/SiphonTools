import RectangularAnnotation from './rectangular_annotation'

export default class Snippet extends RectangularAnnotation {
  //Fragment selection algo
  //1. Find all leaf elements who are 90% covered by the selection area
  //2. Search for a set of parent elements of the leaf elements that account for all the leaf elements
  //   where the area accounted for isn't > than 110% of the selection rectangle
  constructor(rect) {
    super(rect);
  }

  serialize() {
    let save = super.serialize()
    Object.assign(save, {initialDimensions: this.initialDimensions});
    return save;
  }

  deserialize(serialized) {
    super.deserialize(serialized)
    this.initialDimensions = serialized.initialDimensions;
  }

  mark() {
    this.nodes.forEach(elem => {
      let style = window.getComputedStyle(elem);
      if (parseInt(style.paddingLeft) < 5) {
        elem.style.paddingLeft = '5px';
      }
      elem.style.borderLeft = "5px double orange";

      //Add a tracking class to the elems

      elem.classList.add(`siphon-snippet_${this.key}`);
    })
  }

  unmark() {
    super.unmark();
    this.nodes.forEach(elem => {
      elem.style.borderLeft = null;
      elem.style.paddingLeft = null;
      elem.classList.remove(`siphon-snippet_${this.key}`);
    })
  }

}
