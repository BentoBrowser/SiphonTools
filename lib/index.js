import AnchoredAnnotation from './annotation_types/anchored_annotation';
import BaseAnnotation from './annotation_types/base_annotation';
import ElementAnnotation from './annotation_types/element_annotation';
import FragmentAnnotation from './annotation_types/fragment_annotation';
import SelectionAnnotation from './annotation_types/selection_annotation';
import Highlight from './annotation_types/highlight';
import ImageAnnotation from './annotation_types/image_annotation';
import LinkAnnotation from './annotation_types/link_annotation';
import Snippet from './annotation_types/snippet';
import VideoAnnotation from './annotation_types/video_annotation';
import PointAnnotation from './annotation_types/point_annotation';
import Screenshot from './annotation_types/screenshot.js';
import EventListener from './event_listener';
import Store from './store';
import ClickElementSelector from './selectors/click_element_selector';
import DoubleTapSelector from './selectors/double_tap_selector';
import HighlightSelector from './selectors/highlight_selector';
import HoverElementSelector from './selectors/hover_element_selector';
import SnippetSelector from './selectors/snippet_selector';
import ElementSelector from './selectors/element_selector';
import ListAutoSelector from './selectors/list_auto_selector';
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
    initializeSelectors: function (selectors) {
        EventListener.init();
        EventListener.selectors = selectors;
    },
    tearDown: function () {
        EventListener.teardown();
    },
    getSelectionState: function () {
        return EventListener.getSelectionState();
    },
    disable: function () {
        EventListener.disable();
    },
    enable: function () {
        EventListener.enable();
    }
};
export { AnchoredAnnotation, BaseAnnotation, ElementAnnotation, FragmentAnnotation, SelectionAnnotation, Highlight, ImageAnnotation, LinkAnnotation, Snippet, VideoAnnotation, Screenshot, PointAnnotation, ClickElementSelector, DoubleTapSelector, HighlightSelector, HoverElementSelector, SnippetSelector, ElementSelector, ListAutoSelector, Store };
//# sourceMappingURL=index.js.map