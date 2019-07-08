import React, { Component } from "react";
import NavButton from "../navbutton/NavButton";
import selfie from "../../img/pic.jpg";
import "./Header.css";

class Header extends Component {
    constructor() {
        super();

        this.state = {
            active: "public"
        }

        this.navigate = this.navigate.bind(this);
    }

    navigate(name) {
        window.location.hash = name;
        this.setState({ active: name });
    }

    render() {
        const buttonProps = [
            { name: "public", text: "/public" },
            { name: "private", text: "/private" },
            { name: "contact", text: "@contact" }
        ];

        const active = window.location.hash ? window.location.hash.substr(1) : this.state.active;
        buttonProps.forEach(prop => {
            if(active == prop.name)
                prop.active = true;
        });

        this.buttonComponents = buttonProps.map((item, idx) => <NavButton key={idx} item={item} onClick={this.navigate}/>);
        return (
            <div id="header">
                <div id="intro">
                    <img id="selfie" src={selfie} alt="It's me"/>
                    <div className="headerText">
                        hello
                        <br />
                        it's eugene<span className="blinker">.</span>li
                    </div>
                </div>
                
                <br />

                <div id="navBar">
                    {this.buttonComponents}
                </div>
            </div>
          );
    }
}

export default Header;

