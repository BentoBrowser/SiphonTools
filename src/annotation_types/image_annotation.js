import ElementAnnotation from './element_annotation'

export default class Image extends ElementAnnotation{

  constructor(imageNode, cropping) {
    super(imageNode); //Rect should be an object with
    this.src = imageNode.src
    this.allReferences = Array.from(document.querySelectorAll('img')).filter(elem => elem.src == this.src)
    this.cropping = null
    this.text = imageNode.getAttribute('alt') //Save the alt text as the source text
    if (cropping) { //Rect is an optional cropping we have for the image
      this.cropping = {
        left: rect.left || 0,
        right: rect.right || 0,
        top: rect.top || 0,
        bottom: rect.bottom || 0
      }
    }
  }

  serialize() {
    let save = super.serialize()
    Object.assign(save, {src: this.src, cropping: this.cropping})
    return save;
  }

  deserialize(serialized) {
    super.deserialize(serialized)
    this.src = serialized.src
    this.cropping = serialized.cropping
  }

  rehydrate() {
    super.rehydrate()
    this.allReferences = Array.from(document.querySelectorAll('img')).filter(elem => elem.src == this.src)
    if (!this.element) {
      this.element = this.allReferences[0]
    }
    return !!this.element
  }

  mark() {
    this.allReferences.forEach(ref => {
      this.element.classList.add(`siphon-image`)
      this.element.classList.add(`siphon-annotation-${this.key}`);
    })
  }

  unmark() {
    this.allReferences.forEach(ref => {
      this.element.classList.remove(`siphon-image`)
      this.element.classList.remove(`siphon-annotation-${this.key}`)
    })
  }
}
