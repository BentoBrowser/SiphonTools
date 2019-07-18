import FragmentAnnotation, {FragmentSerializedAnnotation} from './fragment_annotation'
import {Dimensions} from './anchored_annotation'

export interface RectangularSerializedAnnotation extends FragmentSerializedAnnotation {
    initialDimensions: Dimensions;
    coordinates: Dimensions;
}

export default class RectangularAnnotation extends FragmentAnnotation {

    public initialDimensions: Dimensions
    public coordinates: Dimensions

    public constructor(origRect: ClientRect) {
        const rect = {top: origRect.top + window.scrollY,
            bottom: origRect.bottom + window.scrollY,
            left: origRect.left + window.scrollX,
            right: origRect.right + window.scrollX,
            width: origRect.width, height: origRect.height}

        let leafNodes = FragmentAnnotation.filterLeafNodes(rect);
        let nodes = FragmentAnnotation.findOptimalParents(leafNodes);
        super(nodes);

        this.initialDimensions = {
            width: rect.width,
            height: rect.height,
        }

        this.coordinates = {
            top: origRect.top,
            bottom: origRect.bottom,
            left: origRect.left,
            right: origRect.right,
        }
    }

    public serialize(): RectangularSerializedAnnotation {
        let save = super.serialize()
        return Object.assign(save, {initialDimensions: this.initialDimensions, coordinates: this.coordinates});
    }

    public deserialize(serialized: RectangularSerializedAnnotation): void {
        super.deserialize(serialized)
        this.initialDimensions = serialized.initialDimensions;
        this.coordinates = serialized.coordinates;
    }

}
