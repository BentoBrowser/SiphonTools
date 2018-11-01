import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Mention} from 'antd'
import 'antd/lib/mention/style/css'
import autobind from 'autobind-decorator'
import {keys, take, orderBy} from 'lodash'
import emoji from 'emojilib'

const { toString, toContentState, getMentions, Nav} = Mention;

const NoteContainer = styled.div`
  background-color: white;
  position: absolute;
  ${({horizontal}) => horizontal? 'top':'right'}: 29px;
  ${({horizontal}) => horizontal? 'left':'top'}: -8px;
  width: 100px;
  padding: 0px;
  margin: 0px;
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Button = styled.div`
  width: calc(100% - 9px);
  padding: 5px;
  text-align: center;
  font-size: 12px;
  background-color: #52c41a;
  color: white;
  margin-left: 0px;
  border-radius: 3px;

  &:hover {
    background-color: #5ddd1d;
    cursor: pointer;
  }
`

const Comment = styled.div`
  font-size: 14px;
  background-color: #ffffd3;
  width: 100%;
  padding: 5px;
  line-height: 1;
  border-bottom: 1px solid #dfdf9f;
`

export default class CommentsToolbar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {text: ''}
  }

  static propTypes = {
    store: PropTypes.object,
    note: PropTypes.object
  }

  @autobind
  handleChange(contentState) {
    this.setState({text: toString(contentState)});
  }

  @autobind
  keyPress(e) {
    //Allow new lines if we are using shift
    if (this.textArea.state.focus && e.key == "Enter" && !e.shiftKey &&
       !this.noteContainer.querySelector('.ant-mention-dropdown')) {
      //Submit the note in this case
      this.saveNote();
      e.preventDefault();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyPress, true);
  }

  @autobind
  saveNote() {
    this.props.store.addComment(this.props.note.key, this.state.text);
    if (this.props.removeToolbar)
      this.props.removeToolbar()
  }

  @autobind
  onSearchChange(value) {
    const searchValue = value.toLowerCase();
    const filtered = take(emoji.ordered.filter(item =>
      item.toLowerCase().indexOf(searchValue) !== -1
    ), 5);
    const suggestions = filtered.map(suggestion => (
      <Nav
        value={emoji.lib[suggestion].char.trim()}
        data={emoji.lib[suggestion]}
      >
        <span>{suggestion} - {emoji.lib[suggestion].char}</span>
      </Nav>
    ));
    this.setState({ suggestions });
  }

  getComments() {
    let comments = this.props.note.comments
    return orderBy(keys(comments), [(key) => comments[key].createdAt], ['asc']).map(annotationKey => {
      let comment = comments[annotationKey];
      return <Comment key={annotationKey}>{comment.text}</Comment>
    })
  }

  componentDidMount() {
    window.addEventListener("keydown", this.keyPress, true)
    if (this.textArea) {
      this.textArea.focus()
    }
  }

  render() {
    let {suggestions} = this.state;

    return (
      <NoteContainer innerRef={ref => this.noteContainer = ref} horizontal={this.props.horizontal}>
        {this.getComments()}
        <Mention onChange={this.handleChange} placeholder="Enter comments here" multiLines
          ref={ref => this.textArea = ref}
          style={{ width: '100%', height: 80, fontSize: 12 }} prefix=":" suggestions={suggestions}
          onSearchChange={this.onSearchChange} notFoundContent="Not Found"
          getSuggestionContainer={() => this.noteContainer}/>
        <Button onClick={this.saveNote}>Save</Button>
      </NoteContainer>
    )
  }
}
