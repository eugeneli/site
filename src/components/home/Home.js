import React, { Component } from "react";
import Header from "../header/Header";
import NavButton from "../navbutton/NavButton";
import Card from "../card/Card";
import Public from "./public";
import Private from "./private";
import Media from "./media";
import Contact from "./contact";
import "./Home.css";

class Home extends Component {
    constructor() {
        super();

        const hash = this.getHash();
        this.state = {
            active: hash
        };

        this.navigate = this.navigate.bind(this);
        this.navigate(hash);
    }

    getHash() {
        return window.location.hash ? window.location.hash.substr(1) : "public";
    }

    navigate(name) {
        window.location.hash = name;
        this.setState({ active: name });
    }

    createButtonComponents() {
        const buttonProps = [
            { name: "public", text: "/public" },
            { name: "private", text: "/private" },
            { name: "media", text: "/media" },
            { name: "contact", text: "@contact" }
        ];

        const hash = this.getHash();
        const active = hash ? hash : this.state.active;
        buttonProps.forEach(prop => {
            if(active === prop.name)
                prop.active = true;
        });

        return buttonProps.map((item, idx) => <NavButton key={idx} item={item} onClick={this.navigate}/>);
    }

    createCardComponents() {
        const page = this.state.active;

        let cards = [];

        if(!page || page == "public")
            cards = Public.map((data, idx) => <Card key={idx} item={data}/>);
        else if(page == "private")
            cards = Private.map((data, idx) => <Card key={idx} item={data}/>);
        else if(page == "media")
            cards = Media.map((data, idx) => <Card key={idx} item={data}/>);
        else if(page == "contact")
            cards = Contact.map((data, idx) => <Card key={idx} item={data}/>);

        return cards;
    }

    render() {
        const buttonComponents = this.createButtonComponents();
        const cardComponents = this.createCardComponents();

        return (
            <div>
                <Header/>
                <br />
                <div id="navBar">
                    {buttonComponents}
                </div>
                <hr className="semidivider"></hr>
                <div id="cards">
                    {cardComponents}
                </div>
            </div>
          );
    }
}

export default Home;

