import React, { useEffect, useRef, useState } from 'react'
import "./modal.css";

export default class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="stanceModal" id="stanceModal">
        <button className="closedButton"> <img src={require("../../../../adhocracy-plus/static/stance_icons/close.png")} alt="Close" onClick={e => {this.props.onClose(e); console.log("CLOSED")}}/></button>
        <div style={{width: "90%"}}>
          <img className="sprechblase" src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase.png")} alt="Sprechblase" />
          <div className="argumentText">  Folgender Kommentar wurde bereits zur Diskussion beigetragen. Möchten Sie darauf antworten?</div>
        </div>
        <div className="content">{this.props.children}
        </div>
      </div>
    );
  }
}

