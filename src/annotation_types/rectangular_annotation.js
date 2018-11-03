import FragmentAnnotation from './fragment_annotation'

export default class RectangularAnnotation extends FragmentAnnotation {

  constructor(rect) {
    rect = {top: rect.top + window.scrollY,
       bottom: rect.bottom + window.scrollY,
       left: rect.left + window.scrollX,
       right: rect.right + window.scrollX,
       width: rect.width, height: rect.height}

    let leafNodes = FragmentAnnotation.filterLeafNodes(rect);
    let nodes = FragmentAnnotation.findOptimalParents(leafNodes);
    super(nodes);

    this.initialDimensions = {
      width: rect.width,
      height: rect.height
    }
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

}
