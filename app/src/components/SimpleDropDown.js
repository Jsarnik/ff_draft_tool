import React  from 'react';
import * as _ from 'lodash';
import { Menu, Dropdown, Button, Icon } from 'antd';

const menu = (props) => (
    <Menu onClick={(e)=>{props.selectFn(e.key)}}>
        {_.map(props.data, d=>{
            return (
                <Menu.Item key={d.value}>
                    {d.text}
                </Menu.Item>
            )
        })}
    </Menu>
)

const SimpleDropDown = (props) => {
    return !_.isEmpty(props.data) ? (
        <Dropdown overlay={menu(props)} disabled={props.isDisabled || false}>
            <Button>
                {props.buttonName} <Icon type="down" />
            </Button>
        </Dropdown>
    ) : null
}

export default SimpleDropDown;
