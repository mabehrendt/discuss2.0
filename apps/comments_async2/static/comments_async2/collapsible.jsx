import React from 'react'
const { Component } = React;

import './collapsible.css'
class Collapse extends Component {
  state = { childHeight: 0 };

  componentDidMount() {
    const childHeightRaw = this.content.clientHeight;
    const childHeight = `${childHeightRaw / 6}rem`;
    console.log(this.props.isOpen)
    this.setState({ childHeight });
  }

  render() {
    const { children, isOpen } = this.props;
    const { childHeight } = this.state;

    return (
      <div className="collapse2" style={{
          maxHeight: isOpen ? childHeight : 0
        }}>
        <div ref={content => (this.content = content)}>{children}</div>
      </div>
    );
  }
}

Collapse.defaultProps = {
  isOpen: false
};

export default Collapse
