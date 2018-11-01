import {last} from "lodash"
import initialValues from './base_css/initialValues'

function resolveHangingTags(originalNodes, cloneNodes) {
  originalNodes = originalNodes.slice(0);
  cloneNodes = cloneNodes.slice(0);

  for (let i = 0; i < cloneNodes.length; i++) {
    let clone = cloneNodes[i];
    let elem = originalNodes[i];

    //Discover if our node needs a better "top level" parent
    let parents = findProperParents(elem, clone);
    //replace this node with the appropriate "top level" parent
    cloneNodes[i] = last(parents.clones);

    //In the rest of our nodes
    for (let j = i + 1; j < cloneNodes.length; j++) {
      //Compare them to the proper parents we found
      for (let v = 0; v < parents.elems.length; v++) {
        let parent = parents.elems[v];

        //And if they are in one of those parent elements
        //contains one of the children we haven't gotten to yet
        if (parent.contains(originalNodes[j])) {
          //find the matching node levels we need to put in this parent

          //If we already have the immediate parent, then just put it in there
          if (Array.from(parent.children).includes(originalNodes[j])) {
            parents.clones[v].appendChild(cloneNodes[j]);
          } else { //Otherwise we need to find the appropriate parent elements up to this one
            let addParents = getNodesToParents(originalNodes[j], cloneNodes[j], parent)
            parents.clones[v].appendChild(last(addParents.clones));

            //We want to keep any new elements found around
            parents.elems.unshift(...addParents.elems);
            parents.clones.unshift(...addParents.clones);
          }

          //And then remove them from the rest of checking
          originalNodes.splice(j, 1);
          cloneNodes.splice(j, 1);
          j--;
          break;
        }
      }
    }
  }
  return cloneNodes;
}

function getNodesToParents(elem, clone, parent) {
  let elems = [];
  let clones = [];

  while (elem.parentElement != parent) {
    let parent = elem.parentElement;
    let parentClone = computedStyleToInlineStyle(parent, {clone: true, recursive: false});
    parentClone.appendChild(clone);
    elems.push(parent);
    clones.push(parentClone);

    clone = parentClone;
    elem = parent;
  }

  return {elems, clones}
}

function findProperParents(elem, clone) {
  let elems = [elem];
  let clones = [clone];

  while(true) {
    //If we found the parent we want
    if (elem == parent) {
      return {elems, clones};
    }

    if (['li', 'dd', 'dt', //list elements
        'tr', 'th', 'td', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot'] //tableElements
        .includes(elem.tagName.toLowerCase())) { //We have a list item, find the parent

      let parent = elem.parentElement;
      let parentClone = computedStyleToInlineStyle(parent, {clone: true, recursive: false});
      //Append the previous child clone to the parent
      parentClone.appendChild(last(clones));
      elems.push(parent);
      clones.push(parentClone);
      elem = parent;
    } else {
      break;
    }
  }

  return {elems, clones};
}

//Partially from https://github.com/lukehorvat/computed-style-to-inline-style
function computedStyleToInlineStyle(element, options = {}) {

    let {recursive = true, clone = false, properties = false} = options;
    if (!element) {
      throw new Error("No element specified.");
    }

    if(clone) {
      if (typeof clone == "boolean") {
        clone = element.cloneNode(recursive);
      }
    }

    if (recursive) {
      Array.prototype.map.call(element.children, function(child, idx) {
        let newOptions = Object.assign({}, options);
        if (clone) {
          newOptions.clone = clone.children[idx];
        }
        computedStyleToInlineStyle(child, newOptions);
      });
    }

    var computedStyle = window.getComputedStyle(element);
    let display = computedStyle.display;

    //Set display to 'none' to get the "used" styles instead of calculated ones
    element.style.display = 'none';
    computedStyle = window.getComputedStyle(element);
    for (var i = 0; i < computedStyle.length; i++) {
      var property = computedStyle.item(i);
      if (!properties || properties.indexOf(property) >= 0) {
        var value = computedStyle.getPropertyValue(property);

        //Only save values that aren't the initial ones for the element
        if (initialValues[element.tagName.toLowerCase()] &&
            initialValues[element.tagName.toLowerCase()][property] != value) {
          if (clone)
            clone.style[property] = value;
          else
            element.style[property] = value;
        }

      }
    }

    if (clone) {
      element.style.display = null;
      clone.style.display = display;

      //TODO possibly expand this to work with all attributes with a relative URL?
      if (clone.hasAttribute("src")) {
        let resolved = new URL(clone.getAttribute("src"), window.location.href);
        clone.setAttribute("src", resolved.href)
      }

      if (clone.hasAttribute("href")) {
        let resolved = new URL(clone.getAttribute("href"), window.location.href);
        clone.setAttribute("href", resolved.href)
      }

      return clone;
    }

    element.style.display = display;
    return element;

  };

export {resolveHangingTags, findProperParents, computedStyleToInlineStyle}
