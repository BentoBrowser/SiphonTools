import RectangularAnnotation from './rectangular_annotation'

export default class Screenshot extends RectangularAnnotation {
  //Fragment selection algo
  //1. Find all leaf elements who are 90% covered by the selection area
  //2. Search for a set of parent elements of the leaf elements that account for all the leaf elements
  //   where the area accounted for isn't > than 110% of the selection rectangle
  constructor(rect) {
    super(rect);
  }

  mark() {
    //We don't really mark screenshots
  }

  unmark() {
    //We don't really mark screenshots
  }

}
