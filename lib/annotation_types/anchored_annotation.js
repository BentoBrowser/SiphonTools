import BaseAnnotation from './base_annotation';
// @ts-ignore
import XPath from 'xpath-dom';
import { uniq } from 'lodash';
function visible(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}
;
export default class AnchoredAnnotation extends BaseAnnotation {
    constructor(anchor) {
        super();
        if (anchor) { //Ack a bit of a shortcut for highlights :(
            this.anchor = anchor;
            this.anchorPath = XPath.getUniqueXPath(this.anchor, document.body);
            this.text = anchor.innerText;
            this.refreshAnchorCoordinates();
        }
    }
    serialize() {
        let save = super.serialize();
        return Object.assign(save, { anchorPath: this.anchorPath || "", text: this.text });
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.anchorPath = serialized.anchorPath;
        this.text = serialized.text;
    }
    rehydrate() {
        this.anchor = XPath.find(this.anchorPath, document.body);
        return !!this.anchor;
    }
    refreshAnchorCoordinates() {
        if (this.anchor) {
            let rect = this.anchor.getBoundingClientRect();
            this.anchorCoordinates = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
        }
    }
    mark() {
        this.refreshAnchorCoordinates();
    }
    unmark() {
        //No-Op in base case
    }
    /**
   * Fragment selection algorithm components below. This:
   *
   * 1. Find all leaf elements who are 90% covered by the selection area
   * 2. Search for a set of parent elements of the leaf elements that account for all the leaf elements
   *   where the area accounted for isn't > than 110% of the selection rectangle
   */
    static closest(num, arr) {
        let curr = null;
        let diff = Infinity;
        arr.forEach((elem) => {
            let rect = elem.getBoundingClientRect();
            let val = rect.right - (rect.width / 2);
            let newdiff = Math.abs(num - val);
            if (newdiff < diff) {
                diff = newdiff;
                curr = elem;
            }
        });
        return curr;
    }
    static filterLeafNodes({ top, left, bottom, right }, includePadding = false) {
        let traverse = (parent) => {
            var nodes = [];
            Array.from(parent.children).forEach((elem) => {
                if (elem.children.length > 0) {
                    nodes = nodes.concat(traverse(elem));
                }
                else {
                    //Only use block level elements and ignore "display none" elements
                    let style = window.getComputedStyle(elem);
                    if (elem.className.indexOf && elem.className.indexOf("siphon-") >= 0)
                        return;
                    while ((style.display || "").indexOf("inline") >= 0) {
                        let rect = this.getAdjustedRect(elem, style, includePadding);
                        //Ignore empty elems
                        let areaChild = rect.width * rect.height;
                        if (areaChild <= 0)
                            return;
                        //let areaSelection = (bottom - top) * (right - left);
                        //Calculate intersection + union of leaf (@see https://stackoverflow.com/questions/9324339/how-much-do-two-rectangles-overlap)
                        let SI = Math.max(0, Math.min(rect.right, right) - Math.max(rect.left, left)) * Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
                        //let SU = areaChild + areaSelection - SI;
                        if (SI > 0) //Just get any elements where there is an intersection
                            nodes.push({ elem: elem, intersection: SI, areaChild: areaChild, style: style });
                        if (elem.parentElement) {
                            elem = elem.parentElement;
                        }
                        else {
                            break;
                        }
                        style = window.getComputedStyle(elem);
                    }
                    //Do the final iteration of this for the block level element
                    let rect = this.getAdjustedRect(elem, style, includePadding);
                    //Ignore empty elems
                    let areaChild = rect.width * rect.height;
                    if (areaChild <= 0)
                        return;
                    //let areaSelection = (bottom - top) * (right - left);
                    //Calculate intersection + union of leaf (@see https://stackoverflow.com/questions/9324339/how-much-do-two-rectangles-overlap)
                    let SI = Math.max(0, Math.min(rect.right, right) - Math.max(rect.left, left)) * Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
                    //let SU = areaChild + areaSelection - SI;
                    if (SI > 0) //Just get any elements where there is an intersection
                        nodes.push({ elem: elem, intersection: SI, areaChild: areaChild, style: style });
                }
            });
            return nodes;
        };
        let touchingNodes = traverse(document.body);
        var threshold = 0.9;
        var filteredNodes = [];
        if (touchingNodes.length) {
            //Remove any nodes who are fixed or their parent element is fixed (usually header / interactive elements)
            touchingNodes = touchingNodes.filter((node) => {
                let elem = node.elem;
                while (elem) {
                    let style = window.getComputedStyle(elem);
                    if (style.position == "fixed") {
                        return false;
                    }
                    elem = elem.parentElement;
                }
                return true;
            });
            while ((filteredNodes.length < 1 || filteredNodes.filter((e) => (e.style.display || "").indexOf("inline") >= 0).length > 0)
                && threshold > 0.5) { //So while we have a no good matching nodes OR those nodes are only inline elements
                // And we're below our threshold, we keep expanding our search radius (aka fuzziness of overlapping area of intersection + area)
                filteredNodes = touchingNodes.filter((node) => node.intersection / node.areaChild >= threshold);
                threshold -= 0.05;
            }
        }
        return uniq(filteredNodes.map((node) => node.elem));
    }
    //Assume Child nodes will fill 90% of the area of their optimal parents
    static findOptimalParents(leafNodes) {
        let parents = new Map();
        let foundNewParent = false;
        //Get the immediate parent for all of our leaf elements
        leafNodes.forEach((elem) => {
            let parent = elem.parentElement;
            if (!parent)
                return;
            let style = window.getComputedStyle(parent);
            //Ensure we have a block level parent
            while ((style.display || "").indexOf("inline") >= 0) {
                if (!parent.parentElement)
                    break;
                parent = parent.parentElement;
                style = window.getComputedStyle(parent);
            }
            //If for some reason we're already tracking this parent, then ignore this signal
            if (leafNodes.indexOf(parent) >= 0) {
                foundNewParent = true;
                return;
            }
            let children = parents.get(parent) || [];
            parents.set(parent, children.concat(elem));
        });
        let newSet = [];
        //Determine how much of the parent's area the child is covering
        parents.forEach((children, parent) => {
            //If would be nice to use a more flexible area formula, but weird padding and margin values can mess this up
            //    let style = window.getComputedStyle(parent);
            //    let parentRect = getAdjustedRect(parent, style);
            //    let parentArea = parentRect.height * parentRect.width;
            //
            //    let childrenArea = children.reduce((totalArea, child) => {
            //      let childRect = child.getBoundingClientRect();
            //      return totalArea + (childRect.width * childRect.height);
            //    }, 0);
            //
            //    //If we explain 90% of the parent's area, then we accept this parent
            //    if (childrenArea / parentArea >= 0.9) {
            //Sadly the above doesn't work in cases with odd padding values -- might still be better in most cases?
            //Only include visible children
            if (Array.from(parent.children).filter((elem) => visible(elem)).length == children.length) {
                foundNewParent = true;
                newSet.push(parent);
            }
            else
                newSet = newSet.concat(children);
        });
        if (foundNewParent)
            return this.findOptimalParents(newSet);
        else
            return leafNodes;
    }
    //Get an adjusted rectangle that accounts for scroll, padding and borders
    static getAdjustedRect(elem, style, includePadding) {
        //Apparently it only uses padding + boarder (not margin) in the computation for bounding client rect
        let rect = elem.getBoundingClientRect();
        if (includePadding) {
            return { top: rect.top + window.scrollY,
                bottom: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                right: rect.right + window.scrollX,
                width: rect.width,
                height: rect.height };
        }
        var borderLeft = parseInt(style.borderLeftWidth || "") || 0;
        var borderRight = parseInt(style.borderRightWidth || "") || 0;
        var borderTop = parseInt(style.borderTopWidth || "") || 0;
        var borderBottom = parseInt(style.borderBottomWidth || "") || 0;
        var paddingLeft = parseInt(style.paddingLeft || "") || 0;
        var paddingRight = parseInt(style.paddingRight || "") || 0;
        var paddingTop = parseInt(style.paddingTop || "") || 0;
        var paddingBottom = parseInt(style.paddingBottom || "") || 0;
        return { top: rect.top + window.scrollY + paddingTop + borderTop,
            bottom: rect.bottom + window.scrollY - paddingBottom - borderBottom,
            left: rect.left + window.scrollX + paddingLeft + borderLeft,
            right: rect.right + window.scrollX - paddingRight - borderRight,
            width: rect.width - paddingLeft - paddingRight - borderLeft - borderRight,
            height: rect.height - paddingTop - paddingBottom - borderTop - borderBottom };
    }
}
//# sourceMappingURL=anchored_annotation.js.map