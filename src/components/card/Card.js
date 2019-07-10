import React, { Component } from "react";
import { Parser } from "html-to-react";
import "./Card.css";

class Card extends Component {
    constructor(props) {
        super(props);

        this.typeTooltips = {
            "github": "View on Github",
            "googlePlay": "View on Google Play",
            "twitter": "View on Twitter",
            "generic": "Visit link"
        };

        this.elRef = React.createRef();
    }

    renderImg(ignore) {
        if(!ignore && this.props.item.link)
            return (
                <a href={this.props.item.link.url}>
                    <img className="cardImg" src={this.props.item.img} alt="Card"/>
                </a>
            );
        else
            return <img className="cardImg" src={this.props.item.img} alt="Card"/>;
    }

    renderLink() {
        if(this.props.item.link)
        {
            const linkType = this.props.item.link.type;
            return (
                <a className="link" href={this.props.item.link.url}>
                    <span className="tooltip">{this.typeTooltips[linkType]}</span>
                    <img src={`../../img/${linkType}.png`} alt="Card"/>
                </a>
            );
        }
    }

    render() {
        const htmlParser = new Parser();
        return (
            <div className="card" ref={this.elRef}>
                {this.renderImg(true)}
                <div className="cardInfo">
                    <span className="cardTitle">
                        {this.props.item.title}
                        {this.renderLink()}
                    </span>
                    <div>
                        {htmlParser.parse(this.props.item.desc)}
                    </div>
                </div>
            </div>
          );
    }
}

export default Card;