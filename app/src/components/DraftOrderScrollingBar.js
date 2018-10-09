import React, { Component } from 'react';
import * as _ from 'lodash';

class DraftOrderScrollingBar extends Component {
    constructor(props) {
        super(props);
        this.divStyle = {
            marginLeft: '0px'
        }
    }  
    
    scrollBar = () =>{
        let _snakeOrder = _.orderBy({...this.props.snakeOrder}, ['overall'], ['asc']);
        return _.map(_snakeOrder, (team, index) => {
            let isSelected = this.props.currentPick.team === team.name ? 'selected' : '';
            let color = `t_${team.colorIndex}`
            return (
                <div key={`snake_${index}`} className={`${isSelected} snake-team-item`}>
                    <div className={`bg ${color}`}></div>
                    <div>{team.displayName}</div>
                    <div>({team.overall})</div>
                </div>
          )
        });
    }

    render() {
        let index = !this.props.currentPick.team ? 0 : this.props.currentPick.overall-1;
        let outerWidthPixels= 101;
        let margin = (outerWidthPixels * index) * -1;

        this.divStyle = {
            marginLeft: `${margin}px`
        };

        return(
            <div className="scroll-bar"> 
                <div className='overlay'></div>
                <div className="scroll-container">
                    <div className="scroll-content" style={this.divStyle}>
                        {this.scrollBar()}
                    </div>
                </div>
            </div>
        )
   }
 }

export default DraftOrderScrollingBar;
