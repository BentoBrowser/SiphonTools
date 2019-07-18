import FragmentAnnotation from './fragment_annotation';
export default class RectangularAnnotation extends FragmentAnnotation {
    constructor(origRect) {
        const rect = { top: origRect.top + window.scrollY,
            bottom: origRect.bottom + window.scrollY,
            left: origRect.left + window.scrollX,
            right: origRect.right + window.scrollX,
            width: origRect.width, height: origRect.height };
        let leafNodes = FragmentAnnotation.filterLeafNodes(rect);
        let nodes = FragmentAnnotation.findOptimalParents(leafNodes);
        super(nodes);
        this.initialDimensions = {
            width: rect.width,
            height: rect.height,
        };
        this.coordinates = {
            top: origRect.top,
            bottom: origRect.bottom,
            left: origRect.left,
            right: origRect.right,
        };
    }
    serialize() {
        let save = super.serialize();
        return Object.assign(save, { initialDimensions: this.initialDimensions, coordinates: this.coordinates });
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.initialDimensions = serialized.initialDimensions;
        this.coordinates = serialized.coordinates;
    }
}
//# sourceMappingURL=rectangular_annotation.js.map