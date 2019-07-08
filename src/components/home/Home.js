import React, { Component } from "react";
import Header from "../header/Header";
import "./Home.css";

class Home extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Header/>
                <hr className="semidivider"></hr>
                <br />
                <div id="cards">
                    
                </div>
            </div>
          );
    }
}

export default Home;

