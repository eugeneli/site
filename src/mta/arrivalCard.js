import React, { Component } from "react";
import icons from "./icons";

class Card extends Component {
    constructor(props) {
        super(props);
    }

    getIcon(routeId) {
        const map = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six",
            "6X": "sixd",
            7: "seven",
            "7X": "sevend"
        };

        if(routeId === "6X" || routeId === "7X")
            return icons[map[routeId]];

        const numTrain = parseInt(routeId);
        if(isNaN(numTrain))
            return icons[routeId];
        
        return icons[map[numTrain]];
    }

    renderImg() {
        return <img className="cardImg" src={this.getIcon(this.props.item.routeId)} alt="Card"/>;
    }

    render() {
        return (
            <div className="card">
                <div className="cardInner">
                    {this.renderImg(true)}
                    <div className="cardInfo">
                        <span className="arrivalTime">
                            {this.props.item.arrivesIn}
                        </span>
                    </div>
                </div>
            </div>
          );
    }
}

export default Card;