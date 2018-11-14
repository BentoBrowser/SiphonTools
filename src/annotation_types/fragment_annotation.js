import AnchoredAnnotation from './anchored_annotation'
import XPath from 'xpath-dom'
import {compact, uniq, sortBy, first} from 'lodash'
import {computedStyleToInlineStyle, resolveHangingTags} from '../inline-style'
import rangyTextRange from 'rangy/lib/rangy-textrange'
import rangy from 'rangy/lib/rangy-core.js';

export default class FragmentAnnotation extends AnchoredAnnotation {

  constructor(nodes) {
    super(nodes[0]);
    this.nodes = nodes;
    this.paths = this.nodes.map((elem) => XPath.getUniqueXPath(elem, document.body));
    this.text = this.nodes.map(elem => rangy.innerText(elem)).join("\n");

    //Inline the styles to html
    let resolvedStyles = ""
    let inlineNodes = this.nodes.map(node => {
      let {element, styleInfo} = computedStyleToInlineStyle(node, {recursive: true, clone: true})
      resolvedStyles += styleInfo
      return element
    })
    let {cloneNodes: resolved, style} = resolveHangingTags(this.nodes, inlineNodes.slice(0));
    resolvedStyles += style
    this.html = resolved.map(elem => elem.outerHTML);
    resolvedStyles = resolvedStyles.trim()
    if (resolvedStyles.length) {
      this.html.push(`<style>${resolvedStyles}</style>`)
    }
    let headerNodes = [];
    this.nodes.forEach(node => {
      if (node.tagName.toLowerCase().match(/^h[1-6]$/))
        headerNodes.push(node);

      headerNodes.push(...node.querySelectorAll('h1,h2,h3,h4,h5.h6'))
    })
    let headerNode = first(sortBy(headerNodes, 'tagName'));
    this.subTitle = (headerNode)? rangy.innerText(headerNode) : null;
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
                        html: this.html});
    return save;
  }

  rehydrate() {
    this.nodes = compact(this.paths.map((path) => XPath.find(path, document.body)));
    this.anchor = this.nodes[0]
    return this.nodes.length === this.paths.length;
  }

  mark() {
    this.nodes.forEach(elem => {
      let style = window.getComputedStyle(elem);
      if (parseInt(style.paddingLeft) < 5) {
        elem.style.paddingLeft = '5px';
      }
      elem.style.borderLeft = "5px double orange";

      //Add a tracking class to the elems

      elem.classList.add(`siphon-snippet`)
      elem.classList.add(`siphon-annotation-${this.key}`);
    })
  }

  unmark() {
    super.unmark();
    this.nodes.forEach(elem => {
      elem.style.borderLeft = null;
      elem.style.paddingLeft = null;
      elem.classList.remove(`siphon-snippet`)
      elem.classList.remove(`siphon-annotation-${this.key}`);
    })
  }

}
