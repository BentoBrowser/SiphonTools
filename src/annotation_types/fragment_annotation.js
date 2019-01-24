import AnchoredAnnotation from './anchored_annotation'
import XPath from 'xpath-dom'
import {compact, uniq, sortBy, first} from 'lodash'
import {computedStyleToInlineStyle, resolveHangingTags} from '../inline-style'
import rangyTextRange from 'rangy/lib/rangy-textrange'
import rangy from 'rangy/lib/rangy-core.js';

function getBGColor(el) {
    var s = getComputedStyle(el),
        b = s.backgroundColor,
        e = el;
    if ((b === "transparent" || b === "rgba(0, 0, 0, 0)" || b === "rgba(255,255,255,0)") && e.parentNode !== null)
        b = getBGColor(e.parentNode);
    return b;
}

export default class FragmentAnnotation extends AnchoredAnnotation {

  constructor(nodes) {
    super(nodes[0]);
    this.nodes = nodes;
    this.paths = this.nodes.map((elem) => XPath.getUniqueXPath(elem, document.body));
    this.text = this.nodes.map(elem => elem.innerText).join("\n");

    this.renderedDimensions = nodes.map(node => node.getBoundingClientRect()).reduce((finalRect, currRect) => {
      return {
        top: Math.min(finalRect.top, currRect.top),
        left: Math.min(finalRect.left, currRect.left),
        bottom: Math.max(finalRect.bottom, currRect.bottom),
        right: Math.max(finalRect.right, currRect.right)
      }
    })
    this.renderedDimensions.width = this.renderedDimensions.right - this.renderedDimensions.left
    this.renderedDimensions.height = this.renderedDimensions.bottom - this.renderedDimensions.top

    //Inline the styles to html
    let resolvedStyles = ""
    let inlineNodes = this.nodes.map(node => {
      let {element, styleInfo} = computedStyleToInlineStyle(node, {recursive: true, clone: true})
      resolvedStyles += styleInfo
      return element
    })

    inlineNodes.forEach(node => Array.from(node.querySelectorAll('style')).forEach(elem => elem.remove()))
    inlineNodes.forEach(node => Array.from(node.querySelectorAll('script')).forEach(elem => elem.remove()))

    //Embed the "visible" background color of these nodes in them
    this.nodes.forEach((node, idx) => {
      inlineNodes[idx].style.backgroundColor = getBGColor(node)
    })

    let {cloneNodes: resolved, style} = resolveHangingTags(this.nodes, inlineNodes.slice(0));
    resolvedStyles += style
    this.html = resolved.map(elem => elem.outerHTML);
    resolvedStyles = resolvedStyles.trim()
    if (resolvedStyles.length) {
      this.html.push(`<style>${resolvedStyles}</style>`)
    }
    //Also try and find any fonts we should try and include??
    //TODO
    let headerNodes = [];
    this.nodes.forEach(node => {
      if (node.tagName.toLowerCase().match(/^h[1-6]$/))
        headerNodes.push(node);

      headerNodes.push(...node.querySelectorAll('h1,h2,h3,h4,h5.h6'))
    })
    let headerNode = first(sortBy(headerNodes, 'tagName'));
    this.subTitle = (headerNode)? headerNode.innerText : null;
  }

  deserialize(serialized) {
    super.deserialize(serialized)
    this.nodes = [];
    this.paths = serialized.paths || [];
    this.subTitle = serialized.subTitle;
    this.html = serialized.html;
  }

  serialize() {
    let save = super.serialize()
    Object.assign(save, {paths: this.paths, subTitle: this.subTitle,
                        html: this.html, renderedDimensions: this.renderedDimensions});
    return save;
  }

  rehydrate() {
    this.nodes = compact(this.paths.map((path) => XPath.find(path, document.body)));
    this.anchor = this.nodes[0]
    return this.nodes.length === this.paths.length;
  }

  mark() {
    this.nodes.forEach(elem => {
      elem.classList.add(`siphon-fragment`)
      elem.classList.add(`siphon-annotation-${this.key}`);
    })
  }

  unmark() {
    super.unmark();
    this.nodes.forEach(elem => {
      elem.classList.remove(`siphon-fragment`)
      elem.classList.remove(`siphon-annotation-${this.key}`);
    })
  }

}
