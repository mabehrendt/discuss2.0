import React, { useEffect, useRef, useState } from 'react'
import "./modal.css";

export default class Modal extends React.Component {

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="stanceModal" id="stanceModal">
        <h2>Kommentarvorschlag</h2>
        <div className="content">{this.props.children}</div>
        <div>
          <button
            onClose={e => {
              this.onClose(e);
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}

