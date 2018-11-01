import ElementAnnotation from './element_annotation'

export default class Link extends ElementAnnotation{

  constructor(linkNode) {
    super(linkNode);
    this.href = linkNode.href
    this.allReferences = Array.from(document.querySelectorAll('a')).filter(elem => elem.href == this.href)
  }

  serialize() {
    let save = super.serialize()
    Object.assign(save, {href: this.href})
    return save;
  }

  deserialize(serialized) {
    super.deserialize(serialized)
    this.href = serialized.href
  }

  rehydrate() {
    super.rehydrate()
    this.allReferences = Array.from(document.querySelectorAll('a')).filter(elem => elem.href == this.href)
    if (!this.element) {
      this.element = this.allReferences[0]
    }
    return !!this.element
  }

  mark() {
    this.allReferences.forEach(ref => {
      ref.classList.add("siphon-note-link")
    })
  }

  unmark() {
    this.allReferences.forEach(ref => {
      ref.classList.remove("siphon-note-link")
    })
  }
}
