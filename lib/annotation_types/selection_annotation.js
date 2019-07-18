import rangy from 'rangy/lib/rangy-core.js';
import { computedStyleToInlineStyle } from '../inline-style';
import AnchoredAnnotation from './anchored_annotation';
import * as XPath from 'xpath-range';
export default class SelectionAnnotation extends AnchoredAnnotation {
    constructor(range) {
        super(range.commonAncestorContainer);
        this.range = new rangy.WrappedRange(range);
        this.text = this.range.toString();
        this.selection = XPath.fromRange(this.range, window.document.body);
        //Get the actual HTML
        this.range.getNodes([1]).forEach((node) => computedStyleToInlineStyle(node, { recursive: true }).element);
        let elem = document.createElement('div');
        elem.appendChild(this.range.cloneContents());
        this.html = elem.innerHTML;
        //Finally, expand the range to grab some surrounding context
        let context = range.cloneRange();
        let startContainer = context.startContainer;
        let endContainer = context.endContainer;
        //Determine how much of the start container we could be keeping
        if (context.startOffset <= 40) {
            context.setStartBefore(startContainer);
        }
        else {
            context.setStart(startContainer, startContainer.startOffset - 40);
        }
        if (context.endContainer.length) {
            if (context.endContainer.length - context.endOffset <= 40) {
                context.setEndAfter(endContainer);
            }
            else {
                context.setEnd(endContainer, context.endOffset + 40);
            }
        }
        elem.innerHTML = "";
        elem.appendChild(context.cloneContents());
        this.contextHTML = elem.innerHTML;
        this.contextText = context.toString();
        this.found = true;
        let rect = range.getBoundingClientRect();
        this.initialDimensions = {
            width: rect.width,
            height: rect.height
        };
        rect = context.getBoundingClientRect();
        this.renderedDimensions = {
            width: rect.width,
            height: rect.height
        };
        this.refreshAnchorCoordinates();
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.selection = serialized.selection;
    }
    serialize() {
        let save = super.serialize();
        return Object.assign(save, { selection: this.selection, contextHtml: this.contextHTML, contextText: this.contextText,
            html: this.html, initialDimensions: this.initialDimensions, renderedDimensions: this.renderedDimensions });
    }
    rehydrate() {
        let { start = '/html/body/', startOffset = 0, end = '/html/body/', endOffset = 0 } = this.selection;
        try {
            this.range = XPath.toRange(start, startOffset, end, endOffset, window.document.body);
            this.range = new rangy.WrappedRange(this.range); //Wrap this to turn it into a Rangy range
            if (this.range.toString().trim() != this.text) { //We can't rely on the range -- fallback to text search
                throw 'Different content in range than highlight';
            }
            this.refreshAnchorCoordinates();
        }
        catch (e) {
            this.range = null;
            //this.markInstance = new Mark(document.body);
        }
        return !!this.range;
    }
    refreshAnchorCoordinates() {
        if (this.range) {
            let rect = this.range.nativeRange.getBoundingClientRect();
            this.anchorCoordinates = { x: rect.x + window.scrollX, y: rect.y + window.scrollY };
        }
    }
}
//# sourceMappingURL=selection_annotation.js.map