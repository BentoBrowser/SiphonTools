import AnchoredAnnotation from './anchored_annotation';
export default class PointAnnotation extends AnchoredAnnotation {
    constructor(point) {
        let leafNodes = [];
        let height = 10;
        while (leafNodes.length < 1 && height < 200) {
            let rect = { top: point.y,
                bottom: point.y + height,
                left: 0 + window.scrollX,
                right: window.innerWidth + window.scrollX,
                width: window.innerWidth, height: height };
            leafNodes = AnchoredAnnotation.filterLeafNodes(rect, true);
            height += 10;
        }
        //Pick the most central node to anchor the text to
        let anchor = AnchoredAnnotation.closest((window.innerWidth + window.scrollX) / 2, leafNodes);
        if (anchor) {
            super(anchor);
        }
    }
}
//# sourceMappingURL=point_annotation.js.map