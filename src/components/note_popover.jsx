import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import {orderBy, keys} from 'lodash'

let Container = styled.div`
  font-family: sans-serif;
  font-size: 14px;
  background: #ffffd3;
  border: 1px solid #dfdf9f;
  box-shadow: 1px 1px 9px lightgrey;
  z-index: 5555;
  width: 100px;
`
const Comment = styled.div`
  font-size: 14px;
  width: 90px;
  padding: 5px;
  line-height: 1;
  border-bottom: 1px solid #dfdf9f;
`

export default function NotePopover({note}) {
  note = note || {};
  let comments = note.comments || {};

  let notes = orderBy(keys(comments), [(key) => comments[key].createdAt], ['asc']).map(key => {
    let comment = comments[key];
    return (<Comment key={key}>
      {comment.text}
    </Comment>)
  })

  return (
      <Container>
        {notes}
      </Container>
  );
}
