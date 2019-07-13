import React, { Component } from "react";
import Floater from "./Floater";
import "./Header.css";

class Header extends Component {
    render() {
        return (
            <div id="header">
                <div id="intro">
                    <img id="selfie" src="../../img/pic2.jpg" alt="It's me"/>
                    <div className="headerText">
                        <span>hello</span> <Floater secs="6"/>
                        <br />
                        <span>it's eugene<span className="blinker">.</span>li</span>
                    </div>
                    <Floater secs="4"/>
                </div>
                <div className="sideFloaters">
                    <Floater color="red" left="8%" />
                    <Floater color="red" left="15%" top="11%"/>
                    <Floater color="red" left="22%" top="17%"/>
                    <Floater color="red" left="30%" top="20%"/>
                </div>
                
                <div className="sideFloaters">
                    <Floater color="red" left="75%" top="3%"/>
                    <Floater color="red" left="78%" top="22%"/>
                    <Floater color="red" left="85%" top="7%"/>
                    <Floater color="red" left="90%" top="19%"/>
                </div>
            </div>
          );
    }
}

export default Header;