import React, { Component }  from 'react';
import * as _ from 'lodash';

class DropDown extends Component {
    constructor(props) {
        super(props);
        this.selectedValue = this.props.data[0].value;
    }

    handleChange = (event) => {
        let val = event.target.value;
        if(val !== this.selectedValue){
            this.selectedValue = val;
            this.props.onSelectFn(this.props.name, val);
        }
    }

    optionsComp = () =>{
        return (
           _.map(this.props.data, (o, i)=>{
                return (
                    <option value={o.value} key={i}>{o.label}</option>
                )
            })
        )
    }

    render() {
        return (
            <div ref={(myElement)=>{this.myElement = myElement;}}>
                <select
                    name={this.props.name}
                    onChange={this.handleChange}
                >
                    {this.optionsComp()}
                </select>
             </div>
        )
    }
}

export default DropDown;
