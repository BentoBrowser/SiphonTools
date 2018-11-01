import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import HighlightHelper from '../highlight_helper'
import {Icon} from 'antd'
import ReactDOM from 'react-dom'
import rangyClassApplier from 'rangy/lib/rangy-classapplier';
import rangy from 'rangy/lib/rangy-core.js';
import autobind from 'autobind-decorator'

let Container = styled.div`
  opacity: 0.85;
  margin: 0px;
  padding: 0px;
  &:hover {
    opacity: 1.0;
  }
  background-color: white;
  max-width: 150px;
  font-family: sans-serif;
  border: 1px solid lightgray;
  box-shadow: 1px 1px 9px lightgrey;
  display: flex;
  flex-direction: ${({horizontal}) => horizontal? 'column':'row'};
`

let Reactions = styled.div`
  display: flex;
  flex-direction: ${({horizontal}) => horizontal? 'row':'column'};
`

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  highlight: props.highlight || {},
                  showNote: props.showNote
                 }
    this.keyListener = this.keyDown.bind(this);
    this.user = props.store.user;
    this.classApplier = rangy.createClassApplier("siphon-temp-selection")
  }

  static defaultProps = {
    showNote: false,
    highlight: {}
  }

  componentWillReceiveProps(nextProps) {
    this.setState({highlight: nextProps.highlight, showNote: nextProps.showNote});
  }

  componentDidMount() {
    if (!this.props.disabled)
      window.addEventListener("keydown", this.keyListener, true)
    // if (this.props.range) {
    //   //make the selection appear with the class classApplier
    //   this.rangyRange = new rangy.WrappedRange(this.props.range);
    //   this.classApplier.applyToRange(this.rangyRange)
    // }
  }

  componentWillUnmount() {
    if (!this.props.disabled)
      window.removeEventListener("keydown", this.keyListener, true);
    // if (this.rangyRange) {
    //   //make the selection appear with the class classApplier
    //   this.classApplier.undoToRange(this.rangyRange)
    // }
  }

  @autobind
  toggleHighlight(e) {
    if (this.props.disabled)
      return;

    e.preventDefault()
    e.stopPropagation()
    if (!this.state.highlight.key) {
      return this.props.store.getNewId().then(key => {
        let highlight;
        if (this.props.range) {
          highlight = HighlightHelper.createHighlightFromRange(key, this.props.range);
          //this.classApplier.undoToRange(this.rangyRange)
        }
        if (this.props.snippetWindow) {
          highlight = HighlightHelper.createSnippetFromRect(key, this.props.snippetWindow.getBoundingClientRect());
          this.props.snippetWindow.remove();
        }
        this.props.store.highlights[highlight.key] = highlight;
        if (highlight) {
          setTimeout(() => {
            this.props.store.saveAnnotation(highlight);
          }, 30) //Give the dom a little time to update before we take a screenshot;
          this.setState({highlight: highlight});
          return highlight
        }
        return null
      })
    } else {
      this.props.store.removeAnnotation(this.state.highlight)
      this.setState({highlight: {}})
      return Promise.resolve(null);
    }
  }

  @autobind
  removeToolbar() {
    if (this.props.disabled)
      return;

    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
  }

  keyDown(e) {
    if (this.props.disabled)
      return;

    if ((e.key == "Enter") && ["INPUT", "TEXTAREA"].indexOf(e.target.nodeName) < 0 && !this.state.showNote) {
      //If we hit space -- if we don't have a highlight we make a simple one
      //Mark this item if we haven't yet
      if (!this.state.highlight.key)
        this.toggleHighlight(e);
      else //Otherwise it opens the notes panel
        //Open the notes panel
        this.setState({showNote: true});

      e.preventDefault();
      e.stopPropagation();
    } else if (e.key == " " && ["INPUT", "TEXTAREA"].indexOf(e.target.nodeName) < 0 && !this.state.showNote) {
      this.showNotes(e)
      e.preventDefault();
      e.stopPropagation();
    }
  }

  @autobind
  addComment(e) {
    if (this.props.disabled)
      return;

    e.preventDefault();
    e.stopPropagation();

    let promise = Promise.resolve(this.state.highlight)
    if (!this.state.highlight.key)
      promise = this.toggleHighlight(e)

    promise.then(highlight => {
      if (highlight) {
        this.props.store.sidebar.setVisibility(true)
        if (this.props.store.sidebar.ready) {
          this.props.store.sidebar.contentWindow.postMessage({type: 'newComment', annotation: JSON.parse(JSON.stringify(highlight))},
                                                            `chrome-extension://${chrome.runtime.id}`)
        } else {
          setTimeout(() => {
            this.props.store.sidebar.contentWindow.postMessage({type: 'newComment', annotation: JSON.parse(JSON.stringify(highlight))},
                                                                `chrome-extension://${chrome.runtime.id}`)
          }, 3000)
        }
      }
    })
  }

  render() {
    let reactions = this.state.highlight.reactions || {};
    let reaction = reactions[this.user];

    return (
        <Container horizontal={this.props.horizontal}>
          <Reactions horizontal={this.props.horizontal}>
            <ToolbarButton type={!this.state.highlight.key? 'save':'delete'} selected={false} onClick={this.toggleHighlight}/>
            <ToolbarButton type="note" selected={this.state.highlight.comments} onClick={this.addComment}/>
            <ToolbarButton type="close" selected={false} onClick={this.removeToolbar}/>
          </Reactions>
        </Container>
    );
  }

}

var getEmojiParams = (type) => {
  switch(type) {
    case 'thumbsUp':
      return {color: '#f9c414', char: faThumbsUp}
    case 'thumbsDown':
      return {color: '#4c4555', char: faThumbsDown}
    case 'heart':
      return {color: '#b63b3b', char: faHeart}
    case 'question':
      return {color: '#22758e', char: faQuestion}
    case 'exclamation':
      return {color: '#ff5a00', char: faExclamation}
    case 'save':
      return {color: '#00C300', char: "save"}
    case 'note':
      return {color: '#ff5a00', char: "edit"}
    case 'close':
      return {color: '#C30000', char: "close"}
    case 'delete':
      return {color: '#C30000', char: "delete"}
  }
}

let ButtonContainer = styled.div`
  display: inline-block;
  width: 28px;
  height: 28px;
  font-size: 16px;
  text-align: center;
  color: ${({selected, color}) => (selected)? color:'#AAAAAA'};
  &:hover {
    color: ${({color}) => color};
  }
  line-height: 27px;
`

var ToolbarButton = ({type, selected, onClick}) => {
  let {color, char} = getEmojiParams(type);
  return (
    <ButtonContainer onClick={onClick} color={color} selected={selected}>
      <Icon type={char} />
    </ButtonContainer>
  )
}
