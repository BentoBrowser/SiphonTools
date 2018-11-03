
import AnchoredAnnotation from './annotation_types/anchored_annotation'
import BaseAnnotation from './annotation_types/base_annotation'
import ElementAnnotation from './annotation_types/element_annotation'
import FragmentAnnotation from './annotation_types/fragment_annotation'
import SelectionAnnotation from './annotation_types/selection_annotation'

import Highlight from './annotation_types/highlight'
import ImageAnnotation from './annotation_types/image_annotation'
import LinkAnnotation from './annotation_types/link_annotation'
import Snippet from './annotation_types/snippet'
import VideoAnnotation from './annotation_types/video_annotation'
import PointAnnotation from './annotation_types/point_annotation'
import Screenshot from './annotation_types/screenshot.js'

import EventListener from './event_listener'
import Store from './store'

import ClickElementTrigger from './triggers/click_element_trigger'
import DoubleTapTrigger from './triggers/double_tap_trigger'
import HighlightTrigger from './triggers/highlight_trigger'
import HoverElementTrigger from './triggers/hover_element_trigger'
import SnippetTrigger from './triggers/snippet_trigger'
import ElementSelector from './triggers/element_selector'

/* An annotation map looks like the following:
{

  triggers: [
    conditions: function(e) {
      //conditions that need to be true for the selection interaction to begin and continue
      //Should return a boolean
    },
    onSelectionStart: function(e) {
      //Handler that will fire when the selection begins
    }
    onSelctionChange: function(e) {
      //Fires as new events come in (some may or my not be relevant to the selection)
    },
    onSelectionEnd: function(e) {
      //either cancel the selection
    }
  ]

  {type: AnnotationType
  id: Annotation_DB_ID} //Mapped elsewhere??
}
*/

export default {
  initializeTriggers: function(triggers) {
    EventListener.init()
    EventListener.triggers = triggers
  },
  tearDown: function() {
    EventListener.teardown()
  },
  getSelectionState: function() {
    EventListener.getSelectionState()
  }
}

export {AnchoredAnnotation, BaseAnnotation, ElementAnnotation, FragmentAnnotation, SelectionAnnotation,
        Highlight, ImageAnnotation, LinkAnnotation, Snippet, VideoAnnotation, Screenshot, PointAnnotation,
        ClickElementTrigger, DoubleTapTrigger, HighlightTrigger, HoverElementTrigger, SnippetTrigger, ElementSelector,
        Store
      }
