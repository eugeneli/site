import React, { Component } from "react";

class Floater extends Component {
    constructor(props) {
        super(props);

        const colors = {
            "blue": "../../img/box.gif",
            "red": "../../img/redbox.gif"
        }

        this.color = this.props.color ? colors[this.props.color] : colors["blue"];

        this.elRef = React.createRef();
    }

    componentDidMount() {
        const secs = this.props.secs ? this.props.secs : 2 + Math.floor(Math.random() * (8 - 2));
        this.elRef.current.style.animation = `float ${secs}s ease-in-out infinite`;

        if(this.props.left)
        {
            this.elRef.current.style.position = "fixed";
            this.elRef.current.style.left = this.props.left;
        }
        if(this.props.top)
        {
            this.elRef.current.style.position = "fixed";
            this.elRef.current.style.top = this.props.top;
        }
    }

    render() {
        return (
            <img className="floater" src={this.color} ref={this.elRef}/>
          );
    }
}

export default Floater;