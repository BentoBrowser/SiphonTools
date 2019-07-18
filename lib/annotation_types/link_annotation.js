import ElementAnnotation from './element_annotation';
export default class Link extends ElementAnnotation {
    constructor(linkNode) {
        super(linkNode);
        this.href = linkNode.href;
        this.allReferences = Array.from(document.querySelectorAll('a')).filter((elem) => elem.href == this.href);
        this.text = linkNode.innerText;
    }
    serialize() {
        let save = super.serialize();
        return Object.assign(save, { href: this.href });
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.href = serialized.href;
    }
    rehydrate() {
        super.rehydrate();
        this.allReferences = Array.from(document.querySelectorAll('a')).filter((elem) => elem.href == this.href);
        if (!this.element) {
            this.element = this.allReferences[0];
        }
        return !!this.element;
    }
    mark() {
        this.allReferences.forEach(() => {
            this.element.classList.add(`siphon-link`);
            this.element.classList.add(`siphon-annotation-${this.key}`);
        });
    }
    unmark() {
        this.allReferences.forEach(() => {
            this.element.classList.remove(`siphon-link`);
            this.element.classList.remove(`siphon-annotation-${this.key}`);
        });
    }
}
//# sourceMappingURL=link_annotation.js.map