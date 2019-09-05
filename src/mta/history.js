import React, { Component } from "react";
import Cookies from "cookies-js";

const MAX = 3;

class History extends Component {
    constructor(props) {
        super(props);

        if(!Cookies.get("history"))
            Cookies.set("history", "[]");
        
        this.state = {
            history: JSON.parse(Cookies.get("history"))
        }
    }

    push(station) {
        let history = JSON.parse(Cookies.get("history"));
        history.unshift(station);
        
        if(history.length > MAX)
            history = history.slice(0, MAX);

        Cookies.set("history", JSON.stringify(history));

        this.setState({ history });
    }

    render() {
        return (
            <div id="history">
                {
                    this.state.history.map(station => 
                        <input type="button" value={station} />
                    )
                }           
            </div>
          );
    }
}

export default History;