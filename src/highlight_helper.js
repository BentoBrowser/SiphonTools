import Highlight from './highlight'
import Snippet from './snippet'
import AnchoredComment from './anchored_comment'
import Image from './image'
import Link from './link'
import Video from './video'

import {NOTE_TYPES} from 'bentowidgets/utils/db_enums'

class BentoHighlighting {


  static createSnippetFromRect(newHighlightKey, rect) {
    let snippet = new Snippet(newHighlightKey);
    snippet.findNodesFromBounds(rect)
    snippet.mark();
    snippet.refreshAnchorCoordinates();
    return snippet;
  }

  // static createSnapshot(newHighlightKey) {
  //   let snapshot = new Snapshot(newHighlightKey);
  //   let widthAdj = window.innerWidth - (window.innerWidth * 0.9);
  //   let heightAdj = window.innerHeight - (window.innerHeight * 0.9);
  //   let rect = {
  //     left: widthAdj / 2,
  //     right: window.innerWidth - (widthAdj / 2),
  //     top: heightAdj / 2,
  //     bottom: window.innerHeight - (heightAdj / 2),
  //     width: window.innerWidth - widthAdj,
  //     height: window.innerHeight - widthAdj
  //   }
  //   snapshot.findNodesFromBounds(rect)
  //   snapshot.mark();
  //   return snapshot;
  // }

  static createHighlightFromRange(newHighlightKey, range) {
    let highlight = new Highlight(newHighlightKey);
    highlight.importRange(range);

//    //Make sure to serialize before markup
//    let serialize = highlight.serialize();
    highlight.mark();
    highlight.refreshAnchorCoordinates();
    return highlight;
  }

  static createHighlightFromSelection(newHighlightKey) {
    let selection = window.getSelection();
    if (selection.rangeCount < 1) {
      return {err: 'Nothing currently selected'}
    }
    let retVal = createHighlightFromRange(newHighlightKey, selection.getRangeAt(0));
    selection.removeAllRanges(); //Clear the selection
    return retVal;
  }

  static createNoteAtPoint(newHighlightKey, point) {
    let note = new AnchoredComment(newHighlightKey);
    note.anchorFromPoint(point)
    note.refreshAnchorCoordinates();
    return note;
  }

  static createNoteFromImage(newHighlightKey, imgNode) {
    let highlight = new Image(newHighlightKey);
    highlight.importImage(imgNode);
    highlight.mark();
    highlight.refreshAnchorCoordinates();
    return highlight;
  }

  static createNoteFromLink(newHighlightKey, linkNode) {
    let highlight = new Link(newHighlightKey);
    highlight.importLink(linkNode);
    highlight.mark();
    highlight.refreshAnchorCoordinates();
    return highlight;
  }

  static createNoteFromVideo(newHighlightKey, videoNode) {
    let highlight = new Video(newHighlightKey);
    highlight.importVideo(videoNode);
    highlight.mark();
    highlight.refreshAnchorCoordinates();
    return highlight;
  }

  static removeAnnotation (annotation) {
    if (annotation) {
      annotation.unmark();
    }
  }
}

export default BentoHighlighting;
