import React, { Component } from "react";

const MAX = 3;

class History extends Component {
    constructor(props) {
        super(props);

        if(!JSON.parse(window.localStorage.getItem("history")))
            window.localStorage.setItem("history", "[]");
        
        this.state = {
            history: this.getHistory()
        }
    }

    getHistory() {
        return JSON.parse(window.localStorage.getItem("history"));
    }

    push(station) {
        let history = this.getHistory();
        if(history.includes(station))
            return;

        history.unshift(station);
        
        if(history.length > MAX)
            history = history.slice(0, MAX);

        window.localStorage.setItem("history", JSON.stringify(history));

        this.setState({ history });
    }

    render() {
        return (
            <div id="historyContainer">
                {
                    this.state.history.map((station, idx) => 
                        <input key={idx} className="history" type="button" value={station} onClick={() => this.props.onClick(station)}/>
                    )
                }           
            </div>
          );
    }
}

export default History;