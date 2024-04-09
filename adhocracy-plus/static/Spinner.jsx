import React from 'react';
import ClockLoader from "react-spinners/ClockLoader";
import { css } from "@emotion/react";

const override = {
    display: "block",
    top: "30%",
    margin: "0 auto",
    borderColor: "red",
    boxShadow: "red 0px 0px 0px 8px inset",
  };

  function Spinner({ spinnerLoading }) {
    return (
      <div id="spinner" style={{backgroundColor:"black", position: "fixed", width:"100%", height:"100%", left:"0%", opacity:"0.5", top:"0%", display: spinnerLoading ? "block" : "none", zIndex:"9999"}}>
        <div style={{position: "fixed", width: "400px", top:"50%", left:"50%", transform: "translate(-50%, -50%)"}}>
          <ClockLoader
            color={"blue"}
            loading={true}
            cssOverride={override}
            size={350}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <p style={{color: "white", position: "absolute", left:"132px", fontSize:"24px"}}>Bitte warten...</p>
        </div>
      </div>
    );
  }
  
  export default Spinner;