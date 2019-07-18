import RectangularAnnotation from './rectangular_annotation';
export default class Screenshot extends RectangularAnnotation {
    //Fragment selection algo
    //1. Find all leaf elements who are 90% covered by the selection area
    //2. Search for a set of parent elements of the leaf elements that account for all the leaf elements
    //   where the area accounted for isn't > than 110% of the selection rectangle
    constructor() {
        //let snapshot = new Snapshot(newHighlightKey);
        let widthAdj = window.innerWidth - (window.innerWidth * 0.9);
        let heightAdj = window.innerHeight - (window.innerHeight * 0.9);
        let rect = {
            left: widthAdj / 2,
            right: window.innerWidth - (widthAdj / 2),
            top: heightAdj / 2,
            bottom: window.innerHeight - (heightAdj / 2),
            width: window.innerWidth - widthAdj,
            height: window.innerHeight - widthAdj
        };
        super(rect);
    }
}
//# sourceMappingURL=screenshot.js.map