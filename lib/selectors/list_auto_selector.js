const CLASS_THRESHOLD = 0.5;
const MIN_LIST_LENGTH = 3;
const IGNORE_TAGS = ["SCRIPT", "STYLE"];
function union(elements) {
    let [left, right, top, bottom] = [Infinity, -Infinity, Infinity, -Infinity];
    elements.forEach((item) => {
        let rect = item.getBoundingClientRect();
        left = Math.min(left, rect.left);
        right = Math.max(right, rect.right);
        top = Math.min(top, rect.top);
        bottom = Math.max(bottom, rect.bottom);
    });
    return { left, right, top, bottom };
}
function findLists(node) {
    //From this node, determine if we have any nice "groupings of children"
    //This is a more "find clusters of similar elements and try to stick them together"
    let lists = [];
    let childrenByTag = new Map();
    let children = Array.from(node.children);
    children.forEach(child => {
        if (IGNORE_TAGS.includes(child.tagName)) {
            return;
        }
        if (!childrenByTag.get(child.tagName)) {
            childrenByTag.set(child.tagName, []);
        }
        childrenByTag.get(child.tagName).push(child);
    });
    var tagClusters = [];
    childrenByTag.forEach((children, tag) => {
        //Ignore any tags that are less than 5
        if (children.length >= MIN_LIST_LENGTH) {
            //Now attempt to cluster any of these based on their classes
            children.forEach(child => {
                let inserted = false;
                for (let i = 0; i < tagClusters.length; i++) {
                    let example = tagClusters[i][0];
                    if (example.tagName != tag)
                        continue;
                    let exampleClasses = Array.from(example.classList);
                    let childClasses = Array.from(child.classList);
                    let intersection = exampleClasses.filter(className => childClasses.indexOf(className) > -1);
                    //We want > 50% of the classes for this item to be shared (or maybe just 1?)
                    //Or if we don't have any classes for either, count that as a grouping as well
                    //if ((!exampleClasses.length && !childClasses.length) || intersection.length / exampleClasses.length > CLASS_THRESHOLD) {
                    if ((!exampleClasses.length && !childClasses.length) || intersection.length > 0) {
                        tagClusters[i].push(child);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) {
                    tagClusters.push([child]);
                }
            });
        }
    });
    //Filter out clusters with less than 5 items
    tagClusters = tagClusters.filter(cluster => cluster.length > MIN_LIST_LENGTH);
    //Finally, attempt to rearrange the items (in DOM order) from our clusters into proper list item groupings
    var listItems = [];
    var startCluster = null;
    var currentItem = [];
    for (let j = children.length - 1; j >= 0; j--) {
        let child = children[j];
        for (let i = 0; i < tagClusters.length; i++) {
            if (tagClusters[i][tagClusters[i].length - 1] == child) {
                if (!startCluster) {
                    startCluster = tagClusters[i];
                }
                else if (tagClusters[i] == startCluster) {
                    listItems.push(currentItem.reverse());
                    currentItem = [];
                }
                currentItem.push(child);
                tagClusters[i].pop();
                break;
            }
        }
    }
    //Reverse everything back
    if (currentItem.length) {
        listItems.push(currentItem);
    }
    listItems.reverse();
    //Not sure if we should -- but standardize length
    //We'll also ignore certain tags for our length computation
    let ignoredLength = (group) => {
        return group.filter(child => !["BR", "WBR"].includes(child.tagName)).length;
    };
    let lengthCounts = {};
    listItems.forEach(group => {
        let length = ignoredLength(group);
        //@ts-ignore
        lengthCounts[length] = lengthCounts[length] || [];
        lengthCounts[length]++;
    });
    let idealLength = -1;
    let idealLengthCount = -1;
    Object.keys(lengthCounts).forEach(length => {
        //@ts-ignore
        if (lengthCounts[length] > idealLengthCount) {
            //@ts-ignore
            idealLength = length;
            //@ts-ignore
            idealLengthCount = lengthCounts[length];
        }
    });
    listItems = listItems.filter(group => ignoredLength(group) == parseInt("" + idealLength));
    //Try and filter out list items based on their actual DOM size of the elements
    if (listItems.length) {
        //Union together the bounding client rects of the children
        let exampleItem = listItems[0];
        let { left, right, top, bottom } = union(listItems[0]);
        let area = (right - left) * (bottom - top);
        if (area > 10000) { //If the area is bigger than the area of a 100 * 100px square, we include this list
            lists.push(listItems[0]);
        }
    }
    children.forEach(child => {
        lists = lists.concat(findLists(child));
    });
    return lists;
}
export default function ListAutoSelector({ trigger, onComplete, onUpdate }) {
    var boundingBoxes = [];
    var lists = null;
    var selectedItems = [];
    var highlightedElement = null;
    trigger = trigger || function ({ currentKey }) {
        return currentKey && currentKey.key == "Shift"
            // @ts-ignore
            && (!currentKey.target || (["INPUT", "TEXTAREA"].indexOf(currentKey.target.nodeName) < 0 && !currentKey.target.isContentEditable));
    };
    return {
        conditions: function (e) {
            return trigger(e);
        },
        onSelectionChange: function ({ causingEvent, mouseDown, mousePosition }) {
            if (causingEvent == "mousedown" && mouseDown && mouseDown.target && mouseDown.target.className.includes("siphon-list-item")) {
                mouseDown.preventDefault();
                mouseDown.stopPropagation();
                //@ts-ignore
                let listIdx = parseInt(mouseDown.target.className.split(" ").find(name => name.includes("siphon-list_")).split("_")[1]);
                //@ts-ignore
                let itemIdx = parseInt(mouseDown.target.className.split(" ").find(name => name.includes("siphon-list-item_")).split("_")[1]);
                let idx = selectedItems.findIndex(item => item[0] == listIdx && item[1] == itemIdx);
                if (idx > -1) {
                    selectedItems.splice(idx, 1);
                    //@ts-ignore
                    mouseDown.target.backgroundColor = '#84e2f199';
                    //@ts-ignore
                    mouseDown.target.classList.remove("siphon-included-item");
                }
                else {
                    selectedItems.push([listIdx, itemIdx]);
                    //@ts-ignore
                    mouseDown.target.style.backgroundColor = '#9af58999';
                    //@ts-ignore
                    mouseDown.target.classList.add("siphon-included-item");
                }
                let remainingBoxes = [];
                boundingBoxes.forEach(box => {
                    if (box.className.includes("siphon-included-item")) {
                        remainingBoxes.push(box);
                    }
                });
                if (onUpdate && selectedItems.length) {
                    //@ts-ignore
                    onUpdate(selectedItems.map(item => lists[item[0]][item[1]]), remainingBoxes);
                }
            }
            else if (mousePosition && highlightedElement != mousePosition.target && mousePosition.target.className.includes("siphon-list-item")) {
                mousePosition.preventDefault();
                mousePosition.stopPropagation();
                if (highlightedElement && !highlightedElement.className.includes("siphon-included-item")) {
                    highlightedElement.style.backgroundColor = '';
                }
                highlightedElement = mousePosition.target;
                if (!highlightedElement.className.includes("siphon-included-item")) {
                    highlightedElement.style.backgroundColor = '#84e2f199';
                }
            }
        },
        onSelectionStart: function (e) {
            selectedItems = [];
            if (!lists)
                lists = findLists(document.body);
            //Read early on to prevent browser reflow issues
            let yOffset = window.pageYOffset;
            let xOffset = window.pageXOffset;
            let rects = lists.map((list) => {
                return list.map((listItem) => {
                    //@ts-ignore
                    return union(listItem);
                });
            });
            //For each of the list items we've found, draw a bounding box around the union of their area
            rects.forEach((list, listIdx) => {
                list.forEach((rect, itemIdx) => {
                    let bounding = document.body.appendChild(document.createElement('div'));
                    bounding.style.position = "absolute";
                    bounding.style.width = `${rect.right - rect.left}px`;
                    bounding.style.height = `${rect.bottom - rect.top}px`;
                    bounding.style.top = `${rect.top + yOffset}px`;
                    bounding.style.left = `${rect.left + xOffset}px`;
                    bounding.style.zIndex = "889944";
                    //@ts-ignore
                    bounding.style.pointer = 'pointer';
                    bounding.style.border = '2px dashed lightgray';
                    bounding.className = `siphon-list-item siphon-list_${listIdx} siphon-list-item_${itemIdx}`;
                    boundingBoxes.push(bounding);
                });
            });
        },
        onSelectionEnd: function (e) {
            let remainingBoxes = [];
            boundingBoxes.forEach(box => {
                if (!box.className.includes("siphon-included-item")) {
                    box.remove();
                }
                else {
                    remainingBoxes.push(box);
                }
            });
            boundingBoxes = [];
            if (onComplete && lists)
                // @ts-ignore
                onComplete(selectedItems.map(item => lists[item[0]][item[1]]), remainingBoxes);
        }
    };
}
/*
Another approch would be an "exemplar" approach where we use the first complete set of items
to determine the rest of the groupings. This could be problematic if the first set is incomplete
/ different from the typical grouping of items

let children = Array.from(node.children)

children.forEach(child => {

})

*/
//# sourceMappingURL=list_auto_selector.js.map