import AnchoredAnnotation from './anchored_annotation';
// @ts-ignore
import XPath from 'xpath-dom';
export default class ElementAnnotation extends AnchoredAnnotation {
    constructor(element) {
        super(element);
        this.element = element;
        this.path = XPath.getUniqueXPath(element, document.body);
        let bounding = element.getBoundingClientRect();
        this.renderedDimensions = {
            height: bounding.height,
            width: bounding.width
        };
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.path = serialized.path;
    }
    serialize() {
        let save = super.serialize();
        return Object.assign(save, { path: this.path, renderedDimensions: this.renderedDimensions });
    }
    rehydrate() {
        this.element = XPath.find(this.path, document.body);
        this.anchor = this.element;
        return !!this.element;
    }
}
//# sourceMappingURL=element_annotation.js.map