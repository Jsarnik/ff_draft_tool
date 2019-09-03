import React, { Component } from 'react';
import './css/main.css';
import Routes from './components/Routes';
import 'antd/dist/antd.css';

class App extends Component {
  constructor(props){
    super(props);
    this.prevWidth = window.innerWidth || 1000;
  }

  render() {
    return (
      <Routes/>
    )
  }
}

export default App;