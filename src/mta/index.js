import React, { Component } from "react";
import moment from "moment";
import ArrivalCard from "./arrivalCard";
//import "./Home.css";

moment.relativeTimeThreshold('ss', 60);
moment.updateLocale('en', {
  relativeTime : {
    s: function (number, withoutSuffix, key, isFuture){
      return number + ' seconds';
    }
  }
});
const URL = "ws://localhost:8085";

class MTA extends Component {
    constructor() {
        super();

        this.ws = new WebSocket(URL);

        this.state = {
            northbound: [],
            southbound: []
        };
    }

    processSchedule(schedule) {
        const diff = (time1, time2) => { 
            const duration = moment.duration(time2.diff(time1));
            const minutes = duration.minutes() > 0 ? duration.minutes() + "m" : "";
            const seconds = duration.seconds() + "s";

            if(seconds < 0)
                return "Arriving now!";

            return `${minutes} ${seconds}`;
        };
        const now = moment();
        return schedule.slice(0,4).map(route => {
            return {
                delay: route.delay,
                arrivesIn: diff(now, moment.unix(route.arrivalTime)),
                departsIn: diff(now, moment.unix(route.departureTime))
            }
        });
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log("ws connected");
        }
    
        this.ws.onmessage = evt => {
            const msg = JSON.parse(evt.data)
            const northbound = this.processSchedule(msg.schedule["M13"]["N"]);
            const southbound = this.processSchedule(msg.schedule["M13"]["S"]);

            this.setState({
                northbound,
                southbound
            });
        }
    }

    createCardComponents(schedule) {
        return schedule.map((arrival, idx) => <ArrivalCard key={idx} item={arrival} />);
    }

    render() {
        return (
            <div>
                Northbound:
                <br />
                { this.createCardComponents(this.state.northbound) }
                <br />
                Southbound:
                <br />
                { this.createCardComponents(this.state.southbound) }
            </div>
          );
    }
}

export default MTA;
