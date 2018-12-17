import AnchoredAnnotation from './anchored_annotation'
import XPath from 'xpath-dom'
import {last} from 'lodash'

export default class ElementAnnotation extends AnchoredAnnotation {

  constructor(element) {
    super(element);
    this.element = element
    this.path = XPath.getUniqueXPath(element, document.body)
    let bounding = element.getBoundingClientRect()
    this.renderedDimensions = {
      height: bounding.height,
      width: bounding.width
    }
  }

  deserialize(serialized) {
    super.deserialize(serialized)
    this.path = serialized.path
  }

  serialize() {
    let save = super.serialize()
    Object.assign(save, {path: this.path, renderedDimensions: this.renderedDimensions})
    return save;
  }

  rehydrate() {
    this.element = XPath.find(this.path, document.body)
    this.anchor = this.element
    return !!this.element
  }

}
