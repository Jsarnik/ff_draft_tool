import React from 'react';
import * as _ from 'lodash';
import TeamLogo from '../TeamLogo';
import { Table, Icon, Empty, Divider } from 'antd';
import {WhiteSpace, Card} from 'antd-mobile';

const MobileTable = (props) => {
    return _.map(props.data, team => {
        return (
            <div key={team.key}>
                <WhiteSpace size='sm'></WhiteSpace>
                <Card>
                    <Card.Header
                        title={
                                <div  style={{width:'100%'}}>
                                    <div className="list-table-item left" style={{width:'80%'}}><TeamLogo size={20} src={team.team_logo} /><span>{team.team}</span></div>
                                    <div className="list-table-item right" style={{width:'20%'}}>Pts</div>
                                </div> 
                                }
                    />
                    <Card.Body>
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'80%'}}><span>Previus Week</span></div>
                            <div className="list-table-item right" style={{width:'20%'}}><span>{team.prev_pts}</span></div>
                        </div> 
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'80%'}}><span>Current Week</span></div>
                            <div className="list-table-item right" style={{width:'20%'}}><span>{team.curr_pts}</span></div>
                        </div> 
                        <Divider></Divider>
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'80%', fontWeight: "bold"}}>Change</div>
                            <div className="list-table-item right" style={{width:'20%'}}>
                            <span style={parseFloat(team.change) > 0 ?  {color: "#3f8600", fontWeight: "bold"} : parseFloat(team.change) === 0 ? {} : {color: "#cf1322", fontWeight: "bold"}}>{team.change.toFixed(2)}</span>
                            </div>
                        </div> 
                    </Card.Body>
                </Card>
                <WhiteSpace size='sm'></WhiteSpace>
            </div>
        )
    })
}

const columns = [
    {
        title: "TEAM",
        className: 'bold',
        dataIndex: "team",
        render: (text, row) =>  <span><TeamLogo src={row.team_logo} /><span>{text}</span></span>
    },
    {
        title: `PREVIOUS WEEK (PTS)`,
        className: 'bold right',
        dataIndex: "prev_pts",
        render: text =>  <span>{text.toFixed(2)}</span>
    },
    {
        title: `CURRENT WEEK (PTS)`,
        className: 'bold right',
        dataIndex: "curr_pts",
        render: text =>  <span>{text.toFixed(2)}</span>
    },
    {
        title: "CHANGE",
        className: 'bold right',
        dataIndex: "change",
        render: text =>  <span style={{fontWeight: "bold", color: parseFloat(text) > 0 ?  "#3f8600" : parseFloat(text) === 0 ? "" : "#cf1322"}}>
                            <span>
                                <span> {parseFloat(text) > 0 ? <Icon type="arrow-up" /> : parseFloat(text) === 0 ? <Icon type="line" /> : <Icon type="arrow-down" />} </span>
                                <span>{Math.abs(parseFloat(text)).toFixed(2)} </span>
                            </span>
                        </span>
    }
];

function buildTableData(_data){
    return _.map(_.orderBy(_data, [(o) => { return o.previous.diff}]), t => {
        return {
            key: t.info.abbrev,
            team: `${t.info.location} ${t.info.nickname} (${t.info.abbrev})`,
            team_logo: t.info.logo,
            prev_pts: t.previous.score,
            curr_pts: t.totalPts,
            change: t.previous.diff
          }
    })
}

const PointsChange = (props) =>{
    const data = props.data[Object.keys(props.data)[0]].previous ? buildTableData(props.data) : null;
    return data ? (
        <div>
            {props.isMobile ?
                <MobileTable data={data}></MobileTable>
            :
                <Table columns={columns} dataSource={data} bordered pagination={false}/>
            }
        </div>
    ) : <Empty />
}

export default PointsChange;