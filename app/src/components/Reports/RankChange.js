import React from 'react';
import * as _ from 'lodash';
import TeamLogo from '../TeamLogo';
import { Table, Icon, Divider } from 'antd';
import { WhiteSpace, Card} from 'antd-mobile';

const MobileTable = (props) => {
    return _.map(props.data, team => {
        return (
            <div>
                <WhiteSpace size='sm'></WhiteSpace>
                <Card key={team.key}>
                    <Card.Header
                        title={
                                <div  style={{width:'100%'}}>
                                    <div className="list-table-item left" style={{width:'75%'}}><TeamLogo size={20} src={team.team_logo} /><span>{team.team}</span></div>
                                    <div className="list-table-item right" style={{width:'25%'}}>Proj. Rank</div>
                                </div> 
                                }
                    />
                    <Card.Body>
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'75%'}}>Rank Post Draft</div>
                            <div className="list-table-item right" style={{width:'25%'}}>{team.rank_draft}</div>
                        </div> 
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'75%'}}>Current Rank</div>
                            <div className="list-table-item right" style={{width:'25%'}}>{team.rank}</div>
                        </div> 
                        <Divider></Divider>
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'75%', fontWeight: "bold"}}>Change</div>
                            <div className="list-table-item right" style={{width:'25%'}}>
                                <span style={{fontWeight: "bold", color: parseInt(team.change) > 0 ?  "#3f8600" : parseInt(team.change) === 0 ? "" : "#cf1322"}}>
                                    <span>
                                        <span> {parseInt(team.change) > 0 ? <Icon type="arrow-up" /> : parseInt(team.change) === 0 ? <Icon type="line" /> : <Icon type="arrow-down" />} </span>
                                        <span>{Math.abs(parseInt(team.change)).toFixed(0)} </span>
                                    </span>
                                </span>
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
        <div>
            {props.isMobile ?
                <MobileTable data={data}></MobileTable>
            :
            <Table columns={columns} dataSource={data} bordered pagination={false}/>
            }
        </div>
    ) : null
}

export default RankChange;