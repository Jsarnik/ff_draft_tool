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
        title: "(PTS)",
        className: 'bold right',
        dataIndex: "team_pts"
    },
    {
        title: "OPPONENT",
        className: 'bold',
        dataIndex: "opp",
        render: (text, row) =>  <span><TeamLogo src={row.opp_logo} /><span>{text}</span></span>
    },
    {
        title: "(PTS)",
        className: 'bold right',
        dataIndex: "opp_pts"
    },
    {
        title: "MARGIN",
        dataIndex: "margin",
        className: 'bold right',
        render: text => <span style={parseFloat(text) > 0 ?  {color: "#3f8600", fontWeight: "bold"} : parseFloat(text) === 0 ? {} : {color: "#cf1322", fontWeight: "bold"}}>{text.toFixed(2)}</span>
    }
];

function buildTableData(_data){
    return _.map(_.orderBy(_data, ['margin'], ['desc']), t => {
        const opp = _data[t.oppId];
        return {
            key: t.info.abbrev,
            team: `${t.info.location} ${t.info.nickname} (${t.info.abbrev})`,
            team_logo: t.info.logo,
            team_pts: t.totalPts,
            opp:`${opp.info.location} ${opp.info.nickname} (${opp.info.abbrev})`,
            opp_logo: opp.info.logo,
            opp_pts: opp.totalPts,
            margin: t.margin
          }
    })
}

const Margins = (props) =>{
    const data = buildTableData(props.data);
    return data ? (
        <Table columns={columns} dataSource={data} bordered pagination={false}/>
    ) : null
}

export default Margins;