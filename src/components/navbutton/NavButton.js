import React, { Component } from "react";
import "./NavButton.css";

class NavButton extends Component {
    constructor(props) {
        super(props);

        this.elRef = React.createRef();

        this.flipActive = this.flipActive.bind(this);
    }

    flipActive() {
        this.setState(prevState => {
            return { active: !prevState.active }
        });
    }

    render() {
        console.log(this.props.item)
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


