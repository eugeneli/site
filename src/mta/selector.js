import React, { Component } from "react";
import Autocomplete from "react-autocomplete";

class Selector extends Component {
    constructor (props) {
        super(props)
        this.state = {
            value: "",
            items: []
        }
    }
  
    render() {
        return (
            <Autocomplete
                items = {this.state.items}
                getItemValue = {item => item.label}
                shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                renderItem = {(item, highlighted) =>
                    <div
                        key={item.id}
                        style={{ backgroundColor: highlighted ? "#eee" : "transparent"}}
                    >
                    {item.label}
                    </div>
                }
                value = {this.state.value}
                onSelect = {value => this.setState({ value })}
                onChange = {e => this.setState({ value: e.target.value })}
                inputProps = {{ placeholder: "Select a station" }}
            />
        )
    }
}

export default Selector;