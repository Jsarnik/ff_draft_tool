import React, { Component } from 'react';
import './css/main.css';
import Routes from './components/Routes';
import 'antd/dist/antd.css';
import 'antd-mobile/dist/antd-mobile.css';

class App extends Component {
  constructor(props){
    super(props);
    this.prevWidth = window.innerWidth || 1000;
    this.state = {
      isMobile: window.innerWidth <= 760
    }
  }

  componentDidMount = () =>{
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize = () => {
    let isChange = ((this.prevWidth > 760 && window.innerWidth <= 760) || (this.prevWidth < 761 && window.innerWidth > 760));
    if(isChange){
      this.prevWidth = window.innerWidth;
      this.setState({
        isMobile: window.innerWidth <= 760
      })
    }
  }

  render() {
    return (
      <Routes isMobile={this.state.isMobile}/>
    )
  }
}

export default App;