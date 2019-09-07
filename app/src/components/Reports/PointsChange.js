import React from 'react';
import * as _ from 'lodash';
import { Table, Icon, Empty } from 'antd';
import TeamLogo from '../TeamLogo';

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
        <Table columns={columns} dataSource={data} bordered pagination={false}/>
    ) : <Empty />
}

export default PointsChange;