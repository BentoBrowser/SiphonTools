import RectangularAnnotation from './rectangular_annotation';
export default class Snippet extends RectangularAnnotation {
    //Fragment selection algo
    //1. Find all leaf elements who are 90% covered by the selection area
    //2. Search for a set of parent elements of the leaf elements that account for all the leaf elements
    //   where the area accounted for isn't > than 110% of the selection rectangle
    constructor(rect) {
        super(rect);
    }
    mark() {
        this.nodes.forEach((elem) => {
            elem.classList.add(`siphon-snippet`);
            elem.classList.add(`siphon-annotation-${this.key}`);
        });
    }
    unmark() {
        super.unmark();
        this.nodes.forEach((elem) => {
            elem.classList.remove(`siphon-snippet`);
            elem.classList.remove(`siphon-annotation-${this.key}`);
        });
    }
}
//# sourceMappingURL=snippet.js.map