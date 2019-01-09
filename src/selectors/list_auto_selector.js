const CLASS_THRESHOLD = 0.5
const MIN_LIST_LENGTH = 5
const IGNORE_TAGS = ["SCRIPT", "STYLE"]

function findLists(node) {
  //From this node, determine if we have any nice "groupings of children"
  //This is a more "find clusters of similar elements and try to stick them together"
  let lists = [];
  let childrenByTag = new Map()
  let children = Array.from(node.children)
  children.forEach(child => {
    if (IGNORE_TAGS.includes(child.tagName)) {
      return;
    }

    if (!childrenByTag.get(child.tagName)) {
      childrenByTag.set(child.tagName, [])
    }
    childrenByTag.get(child.tagName).push(child)
  })



  var tagClusters = []

  childrenByTag.forEach((children, tag) => {
    //Ignore any tags that are less than 5
    if (children.length >= MIN_LIST_LENGTH) {
      //Now attempt to cluster any of these based on their classes

      children.forEach(child => {
        let inserted = false
        for(let i = 0; i < tagClusters.length; i++) {
          let example = tagClusters[i][0]
          if (example.tagName != tag)
            continue;

          let exampleClasses = Array.from(example.classList)
          let childClasses = Array.from(child.classList)

          let intersection = exampleClasses.filter(className => childClasses.indexOf(className) > -1)
          //We want > 50% of the classes for this item to be shared (or maybe just 1?)
          //Or if we don't have any classes for either, count that as a grouping as well
          if ((!exampleClasses.length && !childClasses.length) || intersection.length / exampleClasses.length > CLASS_THRESHOLD) {
            tagClusters[i].push(child)
            inserted = true
            break;
          }
        }
        if (!inserted) {
          tagClusters.push([child])
        }
      })
    }
  })

  //Filter out clusters with less than 5 items
  tagClusters = tagClusters.filter(cluster => cluster.length > MIN_LIST_LENGTH)

  //Finally, attempt to rearrange the items (in DOM order) from our clusters into proper list item groupings
  var listItems = []
  var startCluster = null
  var currentItem = []

  for(let j = children.length - 1; j >= 0; j--) {
    let child = children[j]

    for(let i = 0; i < tagClusters.length; i++) {
      if (tagClusters[i][tagClusters[i].length - 1] == child) {
        if (!startCluster) {
          startCluster = tagClusters[i]
        } else if (tagClusters[i] == startCluster) {
          listItems.push(currentItem.reverse())
          currentItem = []
        }

        currentItem.push(child)
        tagClusters[i].pop()
        break;
      }
    }
  }
  //Reverse everything back
  if (currentItem.length) {
    listItems.push(currentItem)
  }
  listItems.reverse()

  //Not sure if we should -- but standardize length
  //We'll also ignore certain tags for our length computation
  let ignoredLength = (group) => {
    return group.filter(child => !["BR", "WBR"].includes(child.tagName)).length
  }

  let lengthCounts = {}
  listItems.forEach(group => {
    let length = ignoredLength(group)
    lengthCounts[length] = lengthCounts[length] || []
    lengthCounts[length]++
  })
  let idealLength = -1
  let idealLengthCount = -1
  Object.keys(lengthCounts).forEach(length => {
    if (lengthCounts[length] > idealLengthCount) {
      idealLength = length
      idealLengthCount = lengthCounts[length]
    }
  })
  listItems = listItems.filter(group => ignoredLength(group) == parseInt(idealLength))

  //Try and filter out list items based on their actual DOM size of the elements
  if (listItems.length) {
    //Union together the bounding client rects of the children
    let exampleItem = listItems[0]
    let [left, right, top, bottom] = [Infinity,-Infinity,Infinity,-Infinity]

    listItems[0].forEach(item => {
      let rect = item.getBoundingClientRect()
      left = Math.min(left, rect.left)
      right = Math.max(right, rect.right)
      top = Math.min(top, rect.top)
      bottom = Math.max(bottom, rect.bottom)
    })

    let area = (right - left) * (bottom - top)
    if (area > 10000) { //If the area is bigger than the area of a 100 * 100px square, we include this list
      lists.push(listItems)
    }
  }


  children.forEach(child => {
    lists = lists.concat(findLists(child))
  })
  return lists
}


/*
Another approch would be an "exemplar" approach where we use the first complete set of items
to determine the rest of the groupings. This could be problematic if the first set is incomplete
/ different from the typical grouping of items

let children = Array.from(node.children)

children.forEach(child => {

})

*/
