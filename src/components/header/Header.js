import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
    render() {
        return (
            <div id="header">
                <div id="intro">
                    <img id="selfie" src="img/pic.jpg" alt="It's me"/>
                    <div className="headerText">
                        hello
                        <br />
                        it's eugene<span className="blinker">.</span>li
                    </div>
                </div>
            </div>
          );
    }
}

export default Header;