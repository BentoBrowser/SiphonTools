import AnchoredAnnotation, {AnchoredSerializedAnnotation, Dimensions} from './anchored_annotation'
// @ts-ignore
import XPath from 'xpath-dom'

export interface ElementSerializedAnnotation extends AnchoredSerializedAnnotation {
    path: string;
    renderedDimensions: Dimensions;
}

export default class ElementAnnotation extends AnchoredAnnotation {

    public element: HTMLElement;
    public path: string;
    public renderedDimensions: Dimensions

    public constructor(element: HTMLElement) {
        super(element);
        this.element = element
        this.path = XPath.getUniqueXPath(element, document.body)
        let bounding = element.getBoundingClientRect()
        this.renderedDimensions = {
            height: bounding.height,
            width: bounding.width
        }
    }

    public deserialize(serialized: ElementSerializedAnnotation): void {
        super.deserialize(serialized)
        this.path = serialized.path
    }

    public serialize(): ElementSerializedAnnotation {
        let save = super.serialize()
        return Object.assign(save, {path: this.path, renderedDimensions: this.renderedDimensions})
    }

    public rehydrate(): boolean {
        this.element = XPath.find(this.path, document.body)
        this.anchor = this.element
        return !!this.element
    }

}
