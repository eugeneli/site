import React, { Component } from "react";
import icons from "./icons";

class Card extends Component {
    constructor(props) {
        super(props);
    }

    renderImg() {
        console.log(this.props.item.routeId);
        return <img className="cardImg" src={icons[this.props.item.routeId]} alt="Card"/>;
    }
    render() {
        return (
            <div className="card">
                {this.renderImg(true)}
                <div className="cardInfo">
                    <span className="cardTitle">
                        {this.props.item.arrivesIn}
                    </span>
                </div>
            </div>
          );
    }
}

export default Card;