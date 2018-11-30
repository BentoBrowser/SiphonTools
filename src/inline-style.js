import {last} from "lodash"
import initialValues from './base_css/initialValues'

function resolveHangingTags(originalNodes, cloneNodes) {
  originalNodes = originalNodes.slice(0);
  cloneNodes = cloneNodes.slice(0);
  let style = ""

  for (let i = 0; i < cloneNodes.length; i++) {
    let clone = cloneNodes[i];
    let elem = originalNodes[i];

    //Discover if our node needs a better "top level" parent
    let parents = findProperParents(elem, clone);
    //replace this node with the appropriate "top level" parent
    cloneNodes[i] = last(parents.clones);
    style += parents.style

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
            style += addParents.style
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
  return {cloneNodes, style};
}

function getNodesToParents(elem, clone, parent) {
  let elems = [];
  let clones = [];
  let style = ""

  while (elem.parentElement != parent) {
    let parent = elem.parentElement;
    let {element, styleInfo} = computedStyleToInlineStyle(parent, {clone: true, recursive: false});
    element.appendChild(clone);
    elems.push(parent);
    clones.push(element);
    style += styleInfo

    clone = element;
    elem = parent;
  }

  return {elems, clones, style}
}

function findProperParents(elem, clone) {
  let elems = [elem];
  let clones = [clone];
  let style = ""

  while(true) {
    //If we found the parent we want
    if (elem == parent) {
      return {elems, clones};
    }

    if (['li', 'dd', 'dt', //list elements
        'tr', 'th', 'td', 'caption', 'colgroup', 'col', 'thead', 'tbody', 'tfoot'] //tableElements
        .includes(elem.tagName.toLowerCase())) { //We have a list item, find the parent

      let parent = elem.parentElement;
      let {element, styleInfo} = computedStyleToInlineStyle(parent, {clone: true, recursive: false});
      //Append the previous child clone to the parent
      element.appendChild(last(clones));
      elems.push(parent);
      clones.push(element);
      style += styleInfo
      elem = parent;
    } else {
      break;
    }
  }

  return {elems, clones, style};
}

function jsNameToCssName(name)
{
    return name.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function randomCSSClass() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
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
    let styleInfo = "";

    if (recursive) {
      Array.prototype.map.call(element.children, function(child, idx) {
        let newOptions = Object.assign({}, options);
        if (clone) {
          newOptions.clone = clone.children[idx];
        }
        let ret = computedStyleToInlineStyle(child, newOptions);
        styleInfo += ret.styleInfo
      });
    }

    var computedStyle = window.getComputedStyle(element);
    let display = computedStyle.display;

    //Let's determine if we have any pseudo elements by looking at their computed
    //height and width properties
    var beforeElement = window.getComputedStyle(element, "::before")
    var afterElement = window.getComputedStyle(element, "::after")
    var saveBefore, saveAfter;
    if (afterElement.width != "auto" || afterElement.height != "auto") {
      //Record the after element parameters, and save it to be inserted with a CSS style object
      saveAfter = true
    }
    if (beforeElement.width != "auto" || beforeElement.width != "auto") {
      //Record the after element parameters, and save it to be inserted with a CSS style object
      saveBefore = true
    }

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

    let cssClass = randomCSSClass()
    if (saveBefore) {
      computedStyle = window.getComputedStyle(element, "::before");
      styleInfo += `.${cssClass}::before {\n`
      for (var i = 0; i < computedStyle.length; i++) {
        var property = computedStyle.item(i);
        if (!properties || properties.indexOf(property) >= 0) {
          var value = computedStyle.getPropertyValue(property);

          //Only save values that aren't the initial ones for the element
          if (initialValues["::before"] &&  initialValues["::before"][property] != value) {
            if (property == "content") { //We need to escape content appropriately
              var ret = '"'
              for (let i = 1; i < value.length - 1; i++) {
                let charCode = value.charCodeAt(i)
                if (charCode < 128)
                  ret += value.substr(i, i+1)
                else
                  ret += "\\" + charCode.toString(16)
              }
              value = ret + '"'
            }
            styleInfo += `${jsNameToCssName(property)}: ${value};\n`
          }
        }
      }
      styleInfo += "}\n"
    }
    if (saveAfter) {
      computedStyle = window.getComputedStyle(element, "::after");
      styleInfo += `.${cssClass}::after {\n`
      for (var i = 0; i < computedStyle.length; i++) {
        var property = computedStyle.item(i);
        if (!properties || properties.indexOf(property) >= 0) {
          var value = computedStyle.getPropertyValue(property);

          //Only save values that aren't the initial ones for the element
          if (initialValues["::after"] &&  initialValues["::after"][property] != value) {
            if (property == "content") { //We need to escape content appropriately
              var ret = '"'
              for (let i = 1; i < value.length - 1; i++) {
                let charCode = value.charCodeAt(i)
                if (charCode < 128)
                  ret += value.substr(i, i+1)
                else
                  ret += "\\" + charCode.toString(16)
              }
              value = ret + '"'
            }
            styleInfo += `${jsNameToCssName(property)}: ${value};\n`
          }
        }
      }
      styleInfo += "}\n"
    }
    if (saveBefore || saveAfter) {
      if (clone)
        clone.classList.add(cssClass)
      else
        element.classList.add(cssClass)
    }

    if (clone) {
      element.style.display = null;
      clone.style.display = display;

      //Make sure we get the absolute URL saved
      if (clone.hasAttribute("src")) {
        clone.setAttribute("src", element.src)
      }

      if (clone.hasAttribute("href")) {
        clone.setAttribute("href", element.href)
      }

      return {element: clone, styleInfo};
    } else {
      element.style.display = display;
      return {element, styleInfo};
    }
  };

export {resolveHangingTags, findProperParents, computedStyleToInlineStyle}
