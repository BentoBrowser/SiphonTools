import AnchoredAnnotation, { AnchoredSerializedAnnotation } from './anchored_annotation';
export interface Dimensions {
    height: number;
    width: number;
}
export interface ElementSerializedAnnotation extends AnchoredSerializedAnnotation {
    path: string;
    renderedDimensions: Dimensions;
}
export default class ElementAnnotation extends AnchoredAnnotation {
    element: HTMLElement;
    path: string;
    renderedDimensions: Dimensions;
    constructor(element: HTMLElement);
    deserialize(serialized: ElementSerializedAnnotation): void;
    serialize(): ElementSerializedAnnotation;
    rehydrate(): boolean;
}
