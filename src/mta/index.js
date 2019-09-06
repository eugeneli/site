import React, { Component } from "react";
import moment from "moment";
import ArrivalCard from "./arrivalCard";
import History from "./history";
import Selector from "./selector";
import "./index.css";

const URL = `ws://${window.location.hostname}:8085`;

class MTA extends Component {
    constructor() {
        super();

        this.ws = new WebSocket(URL);

        this.state = {
            northbound: [],
            southbound: []
        };

        this.stations = [];

        this.ws.onopen = () => {
            console.log("ws connected");
        }

        this.selectorRef = React.createRef();
        this.submitBtnRef = React.createRef();
        this.historyRef = React.createRef();

        this.updateStation = this.updateStation.bind(this);

        this.queried = false;
    }

    processSchedule(schedule) {
        const diff = (time1, time2) => { 
            const duration = moment.duration(time2.diff(time1));
            const minutes = duration.minutes() > 0 ? duration.minutes() + "m" : "";
            const seconds = duration.seconds() + "s";

            if(duration.seconds() < 0)
                return "Arriving now!";

            return `${minutes} ${seconds}`;
        };
        const now = moment();
        return schedule.sort((a,b) => a.arrivalTime - b.arrivalTime).slice(0,8).map(route => {
            return {
                routeId: route.routeId,
                delay: route.delay,
                arrivesIn: diff(now, moment.unix(route.arrivalTime)),
                departsIn: diff(now, moment.unix(route.departureTime))
            }
        });
    }

    query() {
        this.queried = true;
        const value = this.selectorRef.current.state.value;
        if(value.length < 5)
            return;

        const stationId = value.match(/\(([^)]+)\)/)[1];
        this.ws.send(stationId);
        
        this.historyRef.current.push(value);
    }

    componentDidMount() {
        this.ws.onmessage = evt => {
            const msg = JSON.parse(evt.data)

            if(msg.type === "stations")
            {
                this.stations = msg.stations.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));

                const selector = this.selectorRef.current;
                selector.setState({ items: this.stations });
            }
            else if(msg.type === "update")
            {
                const northbound = this.processSchedule(msg.schedule["N"]);
                const southbound = this.processSchedule(msg.schedule["S"]);

                this.setState({
                    northbound,
                    southbound
                });
            }
        }

        this.submitBtnRef.current.addEventListener("click", () => this.query());
    }

    updateStation(station) {
        this.selectorRef.current.setState({ value: station }, () => this.query());
    }

    createCardComponents(schedule) {
        return schedule.map((arrival, idx) => <ArrivalCard key={idx} item={arrival} />);
    }

    renderQuery() {
        if(!this.queried)
            return (
                <div id="schedule">
                    <h2>Nothing here yet</h2>
                    Select a station and click submit
                </div>
            );

        return (
            <div id="schedule">
                <br />
                <div className="direction">Northbound</div>
                { this.createCardComponents(this.state.northbound) }
                <br />
                <div className="direction">Southbound</div>
                { this.createCardComponents(this.state.southbound) }
            </div>
        );
    }

    render() {
        return (
            <div id="container">
                <div id="selector">
                    <div>
                        <Selector ref={this.selectorRef}/>
                        <input type="button" ref={this.submitBtnRef} value="SUBMIT" id="submitBtn"/>
                    </div>
                    <History ref={this.historyRef} onClick={this.updateStation}/>
                </div>
                { this.renderQuery() }
            </div>
          );
    }
}

export default MTA;
