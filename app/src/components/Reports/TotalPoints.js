import React from 'react';
import * as _ from 'lodash';
import { Table } from 'antd';
import TeamLogo from '../TeamLogo';

const columns = [
    {
        title: "TEAM",
        className: 'bold',
        dataIndex: "team",
        render: (text, row) =>  <span><TeamLogo src={row.team_logo} /><span>{text}</span></span>
    },
    {
        title: "TOTAL POINTS",
        className: 'bold right',
        dataIndex: "pts",
        render: text =>  <span>{text.toFixed(2)}</span>
    }
];

function buildTableData(_data){
    return _.map(_.orderBy(_data, ['totalPts'], ['desc']), t => {
        return {
            key: t.info.abbrev,
            team: `${t.info.location} ${t.info.nickname} (${t.info.abbrev})`,
            team_logo: t.info.logo,
            pts: t.totalPts
          }
    })
}

const TotalPoints = (props) =>{
    const data = buildTableData(props.data);
    return data ? (
        <Table columns={columns} dataSource={data} bordered pagination={false}/>
    ) : null
}

export default TotalPoints;