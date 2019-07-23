
import AnchoredAnnotation, {AnchoredSerializedAnnotation} from './annotation_types/anchored_annotation'
import BaseAnnotation from './annotation_types/base_annotation'
import ElementAnnotation, {ElementSerializedAnnotation} from './annotation_types/element_annotation'
import FragmentAnnotation, {FragmentSerializedAnnotation} from './annotation_types/fragment_annotation'
import SelectionAnnotation, {SelectionSerializedAnnotation} from './annotation_types/selection_annotation'
import {RectangularSerializedAnnotation} from './annotation_types/rectangular_annotation'

import Highlight from './annotation_types/highlight'
import ImageAnnotation, {ImageSerializedAnnotation} from './annotation_types/image_annotation'
import LinkAnnotation, {LinkSerializedAnnotation} from './annotation_types/link_annotation'
import Snippet from './annotation_types/snippet'
import VideoAnnotation, {VideoSerializedAnnotation} from './annotation_types/video_annotation'
import PointAnnotation from './annotation_types/point_annotation'
import Screenshot from './annotation_types/screenshot.js'

import EventListener, {SelectionState} from './event_listener'
import Store from './store'

import ClickElementSelector from './selectors/click_element_selector'
import DoubleTapSelector from './selectors/double_tap_selector'
import HighlightSelector from './selectors/highlight_selector'
import HoverElementSelector from './selectors/hover_element_selector'
import SnippetSelector from './selectors/snippet_selector'
import ElementSelector from './selectors/element_selector'
import ListAutoSelector from './selectors/list_auto_selector'
import Selector from './selectors/selector'

/* An annotation map looks like the following:
{

  selectors: [
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
    initializeSelectors: function(selectors: Selector[]): void {
        EventListener.init()
        EventListener.selectors = selectors
    },
    tearDown: function(): void {
        EventListener.teardown()
    },
    getSelectionState: function(): SelectionState  {
        return EventListener.getSelectionState()
    },
    disable: function(): void  {
        EventListener.disable()
    },
    enable: function(): void  {
        EventListener.enable()
    }
}

export {AnchoredSerializedAnnotation, ElementSerializedAnnotation, FragmentSerializedAnnotation, SelectionSerializedAnnotation, RectangularSerializedAnnotation, ImageSerializedAnnotation, LinkSerializedAnnotation, VideoSerializedAnnotation}
export {AnchoredAnnotation, BaseAnnotation, ElementAnnotation, FragmentAnnotation, SelectionAnnotation,
    Highlight, ImageAnnotation, LinkAnnotation, Snippet, VideoAnnotation, Screenshot, PointAnnotation,
    ClickElementSelector, DoubleTapSelector, HighlightSelector, HoverElementSelector, SnippetSelector, ElementSelector, ListAutoSelector,
    Store
}
