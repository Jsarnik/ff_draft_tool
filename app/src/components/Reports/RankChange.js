import React from 'react';
import * as _ from 'lodash';
import { Table, Icon } from 'antd';
import TeamLogo from '../TeamLogo';

const columns = [
    {
        title: "TEAM",
        className: 'bold',
        dataIndex: "team",
        render: (text, row) =>  <span><TeamLogo src={row.team_logo} /><span>{text}</span></span>
    },
    {
        title: "PROJ. RANK (DRAFT DAY)",
        className: 'bold right',
        dataIndex: "rank_draft"
    },
    {
        title: "PROJ. RANK (CURRENT)",
        className: 'bold right',
        dataIndex: "rank"
    },
    {
        title: "CHANGE",
        className: 'bold right',
        dataIndex: "change",
        render: text => <span style={{fontWeight: "bold", color: parseInt(text) > 0 ?  "#3f8600" : parseInt(text) === 0 ? "" : "#cf1322"}}>
                            <span>
                                <span> {parseInt(text) > 0 ? <Icon type="arrow-up" /> : parseInt(text) === 0 ? <Icon type="line" /> : <Icon type="arrow-down" />} </span>
                                <span>{Math.abs(parseInt(text)).toFixed(0)} </span>
                            </span>
                        </span>
        }
];

function buildTableData(_data){
    return _.map(_.orderBy(_data, [(o) => { return o.info.currentProjectedRank }]), t => {
        return {
            key: t.info.abbrev,
            team: `${t.info.location} ${t.info.nickname} (${t.info.abbrev})`,
            team_logo: t.info.logo,
            rank_draft: t.info.draftDayProjectedRank,
            rank: t.info.currentProjectedRank,
            change: t.info.draftDayProjectedRank - t.info.currentProjectedRank
          }
    })
}

const RankChange = (props) =>{
    const data = buildTableData(props.data);
    return data ? (
        <Table columns={columns} dataSource={data} bordered pagination={false}/>
    ) : null
}

export default RankChange;