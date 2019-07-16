import BaseAnnotation, { SerializedAnnotation } from './base_annotation';
export interface AnchoredSerializedAnnotation extends SerializedAnnotation {
    anchorPath: string;
}
export default class AnchoredAnnotation extends BaseAnnotation {
    anchor?: HTMLElement;
    anchorPath?: string;
    anchorCoordinates?: {
        x: number;
        y: number;
    };
    constructor(anchor: HTMLElement);
    serialize(): AnchoredSerializedAnnotation;
    deserialize(serialized: AnchoredSerializedAnnotation): void;
    rehydrate(): boolean;
    refreshAnchorCoordinates(): void;
    mark(): void;
    unmark(): void;
    /**
     * Fragment selection algorithm components below. This:
     *
     * 1. Find all leaf elements who are 90% covered by the selection area
     * 2. Search for a set of parent elements of the leaf elements that account for all the leaf elements
     *   where the area accounted for isn't > than 110% of the selection rectangle
     */
    static closest(num: number, arr: HTMLElement[]): HTMLElement;
    static filterLeafNodes({ top, left, bottom, right }: {
        top: number;
        left: number;
        bottom: number;
        right: number;
    }, includePadding?: boolean): Element[];
    static findOptimalParents(leafNodes: Element[]): Element[];
    static getAdjustedRect(elem: Element, style: CSSStyleDeclaration, includePadding: boolean): ClientRect;
}
