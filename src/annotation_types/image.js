import ElementAnnotation from './element_annotation'

export default class Image extends ElementAnnotation{

  constructor(imageNode) {
    super(imageNode);
    this.src = imageNode.src
    this.allReferences = Array.from(document.querySelectorAll('img')).filter(elem => elem.src == this.src)
  }

  serialize() {
    let save = super.serialize()
    Object.assign(save, {src: this.src})
    return save;
  }

  deserialize(serialized) {
    super.deserialize(serialized)
    this.src = serialized.src
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
      ref.classList.add("siphon-note-image")
    })
  }

  unmark() {
    this.allReferences.forEach(ref => {
      ref.classList.remove("siphon-note-image")
    })
  }
}
