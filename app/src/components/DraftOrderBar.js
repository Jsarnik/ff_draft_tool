import React, { Component } from 'react';
import * as _ from 'lodash';
import { Card } from 'antd';

const Round = (props) =>{
    return _.map(props.data, r => {
        return (
            <Card style={{
                textAlign: 'center',
                display: 'inline-block'
            }}
            >
                <Card.Grid style={{
                    width: '10px',
                    textAlign: 'center',
                }}>
                <div>{r.round}</div>
                <div>R</div>
                </Card.Grid>
                <Position currentPick={props.currentPick} data={r}></Position>
            </Card>
        )
    })
}

const Position = (props) =>{
    const [overall, teamId] = [parseInt(props.currentPick.overall), parseInt(props.currentPick.teamId)];
    return _.map(props.data.order, position => {
        let selectedPick = overall === parseInt(position.overall) && teamId === parseInt(position.id) ? 'selected' : '';
        return (
            <Card.Grid style={{
                width: '200px',
                textAlign: 'center',
              }} className={`snake-card ${selectedPick}`}>
              <div>{position.location}</div>
              <div>({position.abbrev})</div>
            </Card.Grid>
        )
    })
}

class DraftOrderBar extends Component {
    constructor(props){
        super();
        this.state = {

        }
    }

    componentDidMount = () =>{
        
    }

    render() {
        return this.props.model ? (
            <div style={{marginTop: 25, width:'100%', overflow: 'scroll', position: 'fixed', zIndex: 100, top: 0, left: 0}}>
                <div style={{width:'100000px'}}>
                    <Round data={this.props.model} currentPick={this.props.teamOverallPick}></Round>
                </div>
            </div>
        ) : null;
    }
 }

export default DraftOrderBar;
