import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Icon} from 'antd'
import autobind from 'autobind-decorator'
import ReactDOM from 'react-dom'

const Preview = styled.div`
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 50000000000000;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  border-color: rgba(0,0,0,0.09);
  padding: 3px;
  background-color: white;
  transition: all 0.1s ease-in;
  opacity: 0.7;
  &:hover {
    opacity: 1.0;
  }
`

let StyledIcon = styled(Icon)`
  line-height: 22px !important;
  transition: all 0.1s ease-in;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
    color: red;
  }
  position: absolute;
  right: 10px;
  color: #888888;
  font-weight: 900;
  background-color: white;
`

export default class ScreenshotPreview extends React.PureComponent {
  static propTypes = {
    image: PropTypes.string.isRequired,
    highlight: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired
  }

  @autobind
  remove() {
    let {store, highlight} = this.props;
    store.removeAnnotation(store.highlights[highlight]);
    ReactDOM.unmountComponentAtNode(this.props.comp);
  }

  componentDidMount() {
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(this.props.comp);
    }, 10000)
  }
  
  render() {
    let {image} = this.props;
    
    return <Preview>
      <StyledIcon type="close-square" onClick={this.remove} />
      <img src={image} style={{height: 100}}/>
    </Preview>
  }
  
}
