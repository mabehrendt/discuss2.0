import * as React from 'react';
import Modal from './stance_modal.jsx'
import "./collapsible.css";

function IntroVideo({ path, modalQuestState, showQuestModal}) {
    return(
        <Modal show={modalQuestState.isOpen}>
              <div className="questModal" id="questModal">
                <img className="questblase" src={require("./stance_icons/video.png")} alt="Quest" />
                <button className="closedButton"> <img className="close" src={require("./stance_icons/close.png")} alt="Close" onClick={e => {showQuestModal(e); console.log("CLOSED")}}/></button>
                <div style={{display: "flex", flexDirection: "column", padding: "20px 40px 20px 0px", paddingLeft: "0px"}}>
                  {/* Embed video here */}
                  <iframe class="introVideo" src={path} frameBorder='0' allowFullScreen></iframe>
                </div>
              </div>
        </Modal>
      )
}

export default IntroVideo;