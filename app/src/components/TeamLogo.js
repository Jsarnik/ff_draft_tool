import React from 'react';
import {Avatar} from 'antd';

const TeamLogo = (props) => {
    return (<Avatar size={30} style={{marginRight: 5}} src={props.src} />)
}

export default TeamLogo;