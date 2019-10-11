import AnchoredAnnotation, {Dimensions, AnchoredSerializedAnnotation} from './anchored_annotation'
// @ts-ignore
import XPath from 'xpath-dom'
import {computedStyleToInlineStyle, resolveHangingTags} from '../inline-style'

const sortBy = (key: string): (a: any, b: any) => number => {
    return (a: any, b: any): number => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
};

function getBGColor(el: Element): string | null {
    var s = getComputedStyle(el),
        b = s.backgroundColor,
        e = el;
    if ((b === "transparent" || b === "rgba(0, 0, 0, 0)" || b === "rgba(255,255,255,0)") && e.parentNode !== null && e.parentNode !== document)
        b = getBGColor(e.parentNode as HTMLElement);
    return b;
}

export interface FragmentSerializedAnnotation extends AnchoredSerializedAnnotation {
    paths: string[];
    subTitle: string | null;
    html: string[];
}

export default class FragmentAnnotation extends AnchoredAnnotation {

    public nodes: HTMLElement[];
    public paths: string[];
    public renderedDimensions: Dimensions
    public subTitle: string | null
    public html: string[]

    public constructor(nodes: HTMLElement[]) {
        super(nodes[0]);
        this.nodes = nodes;
        this.paths = this.nodes.map((elem): string => XPath.getUniqueXPath(elem, document.body));
        this.text = this.nodes.map((elem): string => elem.innerText).join("\n");

        let bounding = nodes.map((node): DOMRect | ClientRect => node.getBoundingClientRect())
            .reduce((finalRect, currRect): {top: number; left: number; right: number; bottom: number} => {
                return {
                    top: Math.min(finalRect.top, currRect.top),
                    left: Math.min(finalRect.left, currRect.left),
                    bottom: Math.max(finalRect.bottom, currRect.bottom),
                    right: Math.max(finalRect.right, currRect.right)
                }
            }, {top: 0, left: 0, right: 0, bottom: 0})
        this.renderedDimensions = {
            ...bounding,
            width: bounding.right - bounding.left,
            height: bounding.bottom - bounding.top
        }

        //Inline the styles to html
        let resolvedStyles = ""
        let inlineNodes = this.nodes.map((node): HTMLElement => {
            let {element, styleInfo} = computedStyleToInlineStyle(node, {recursive: true, clone: true})
            resolvedStyles += styleInfo
            return element
        })

        inlineNodes.forEach(node => Array.from(node.querySelectorAll('style')).forEach(elem => elem.remove()))
        inlineNodes.forEach(node => Array.from(node.querySelectorAll('script')).forEach(elem => elem.remove()))

        //Embed the "visible" background color of these nodes in them
        this.nodes.forEach((node, idx): void => {
            inlineNodes[idx].style.backgroundColor = getBGColor(node)
        })

        let {cloneNodes: resolved, style} = resolveHangingTags(this.nodes, inlineNodes.slice(0) as HTMLElement[]);
        resolvedStyles += style
        this.html = resolved.map((elem): string => elem.outerHTML);
        resolvedStyles = resolvedStyles.trim()
        if (resolvedStyles.length) {
            this.html.push(`<style>${resolvedStyles}</style>`)
        }
        //Also try and find any fonts we should try and include??
        //TODO
        let headerNodes: Element[] = [];
        this.nodes.forEach((node): void => {
            if (node.tagName.toLowerCase().match(/^h[1-6]$/))
                headerNodes.push(node);

            headerNodes.push(...node.querySelectorAll('h1,h2,h3,h4,h5.h6'))
        })
        let headerNode = headerNodes.concat().sort(sortBy('tagName'))[0];
        this.subTitle = (headerNode)? (headerNode as HTMLElement).innerText : null;
    }

    public deserialize(serialized: FragmentSerializedAnnotation): void {
        super.deserialize(serialized)
        this.nodes = [];
        this.paths = serialized.paths || [];
        this.subTitle = serialized.subTitle;
        this.html = serialized.html;
    }

    public serialize(): FragmentSerializedAnnotation {
        let save = super.serialize()
        return Object.assign(save, {paths: this.paths, subTitle: this.subTitle,
            html: this.html, renderedDimensions: this.renderedDimensions});
    }

    public rehydrate(): boolean {
        this.nodes = this.paths.map((path): HTMLElement => XPath.find(path, document.body)).filter(Boolean);
        this.anchor = this.nodes[0]
        return this.nodes.length === this.paths.length;
    }

    public mark(): void {
        this.nodes.forEach((elem): void => {
            elem.classList.add(`siphon-fragment`)
            elem.classList.add(`siphon-annotation-${this.key}`);
        })
    }

    public unmark(): void {
        super.unmark();
        this.nodes.forEach((elem): void => {
            elem.classList.remove(`siphon-fragment`)
            elem.classList.remove(`siphon-annotation-${this.key}`);
        })
    }

}
