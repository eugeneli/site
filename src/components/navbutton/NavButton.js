import React, { Component } from "react";
import "./NavButton.css";

class NavButton extends Component {
    constructor(props) {
        super(props);

        this.elRef = React.createRef();
    }

    render() {
        return (
            <span className={this.props.item.active ? "navButton active" : "navButton"} ref={this.elRef}>
                {this.props.item.text}
            </span>
        );
    }

    componentDidMount() {
        this.elRef.current.addEventListener("click", () => this.props.onClick(this.props.item.name));
    }

    //Destroy the listener when this component is destroyed
    componentWillUnmount() {
        this.elRef.current.removeEventListener("click");
    }
}

export default NavButton;


