import React, { Component } from 'react';

class Timer extends Component {
    constructor(props) {
        super(props);

        this.clockInterval;
        this.defaultTime = this.props.clockOptions.pickAllowedTime || 10;
    }

    componentDidMount = () =>{
        this.handleClick(this.props.clockOptions.isTimerRunning, this.props.clockOptions.isTimerReset);
    }

    handleClick = (isStart, isReset) =>{
        this.props.updateTimerFn(isStart, isReset ? this.defaultTime : this.props.clockOptions.remainingPickTimeSec);
        if(isStart){
            this.props.tryGoToNextEligiblePick();
            this.startClock();
        }else{
            clearInterval(this.clockInterval);
        }
    }

    startClock = () =>{
        this.clockInterval = setInterval(() => {
            if(this.props.clockOptions.isTimerRunning && this.props.clockOptions.remainingPickTimeSec !== 0){
                return this.props.updateTimerFn(this.props.clockOptions.isTimerRunning, this.props.clockOptions.remainingPickTimeSec - 1);
            }

            clearInterval(this.clockInterval);
            this.props.autoDraftPlayerFn(null);
            this.handleClick(true, true);
        }, 1000)
    }

    buttonDisplay= () =>{
        if(this.props.clockOptions.isTimerRunning){
            return (
                <div className="flex-item">
                    <div className="button" onClick={(e)=>this.handleClick(false)}>Pause</div>
                </div>
            )
        }else{
            return (
                <div className="flex-container">
                    <div className="flex-item">
                        <div className="button" onClick={(e)=>this.handleClick(true)}>Start</div>
                    </div>
                    <div className="flex-item">
                        <div className="button" onClick={(e)=>this.handleClick(false, true)}>Reset</div>
                    </div>
                </div>
            )
        }
    }

    countDownClock = () =>{
        return  (
            this.props.clockOptions.isTimerRunning && this.props.clockOptions.remainingPickTimeSec <= 10 ?
            <div className="count-down-clock">
                {this.props.clockOptions.remainingPickTimeSec}
            </div> : 
            <div>{this.props.clockOptions.remainingPickTimeSec}</div> 
        )
    }

    render() {
     return(
         <div className="flex-container timer">
            <div className="flex-item">Time:</div>
            <div className="flex-item">
                {this.countDownClock()}
            </div>
            
            {this.buttonDisplay()}
         </div>
     )
   }
 }

export default Timer;
