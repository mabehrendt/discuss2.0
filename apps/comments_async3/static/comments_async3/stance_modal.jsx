import React, { useEffect, useRef, useState } from 'react'
import "./modal.css";

export default class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
        <div className="content">{this.props.children}
        </div>
    );
  }
}

