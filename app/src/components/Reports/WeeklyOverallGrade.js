import React from 'react';
import * as _ from 'lodash';
import { Table, Divider, Empty } from 'antd';
import TeamLogo from '../TeamLogo';
import { WhiteSpace, Card} from 'antd-mobile';

const MobileTable = (props) => {
    return _.map(props.data, team => {
        return (
            <div key={team.key}>
                <WhiteSpace size="sm"></WhiteSpace>
                <Card >
                    <Card.Header
                        title={
                            <div style={{marginTop: 10}}>
                                <div className="list-table-item left" style={{width:'80%'}}><div><TeamLogo size={20} src={team.team_logo} /><span>{team.team}</span></div></div>
                                <div style={{textAlign: 'right'}} className="list-table-item right" style={{width:'20%'}}>Grade</div>
                            </div> 
                        }
                    />
                    <Card.Body>
                        {
                            _.map(team.breakdown, score => {
                                return (
                                    <div style={{marginTop: 10}} key={score.name}>
                                        <div className="list-table-item left" style={{width:'80%'}}>
                                            <div>
                                                <span>{score.name}:</span>
                                            </div>
                                            <div>
                                                (rank {score.rank}) - ({score.perc * 100}% X {score.total}) = 
                                            </div>
                                        </div>
                                        <div className="list-table-item right" style={{width:'20%'}}>{score.val}</div>
                                    </div> 
                                )
                            })
                        }
                        <Divider></Divider>
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'80%', fontWeight: "bold"}}>Total</div>
                            <div className="list-table-item right" style={{width:'20%'}}>
                                <span>{team.gradeScore.toFixed(2)}</span>
                            </div>
                        </div> 
                    </Card.Body>
                </Card>
                <WhiteSpace size="sm"></WhiteSpace>
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
        title: "CALCULATION",
        className: 'bold left',
        dataIndex: "breakdown",
        render: text =>  {
            return _.map(text, score => {
                return (
                    <div key={score.name}>
                        <span>{score.name}: (rank {score.rank}) - ({score.perc * 100}% X {score.total}) = {score.val}</span>
                    </div>
                )
            })
        }
    },
    {
        title: "GRADE",
        className: 'bold right',
        dataIndex: "gradeScore",
        render: text =>  <span style={{fontWeight: "bold"}}>
                            {Math.abs(parseFloat(text)).toFixed(2)}
                        </span>
    }
];

function buildTableData(_data){
    return _.map(_.orderBy(_data, ['gradeScore'], ['desc']), t => {
        return {
            key: t.info.abbrev,
            team: `${t.info.location} ${t.info.nickname} (${t.info.abbrev})`,
            team_logo: t.info.logo,
            breakdown: t.grades,
            gradeScore: t.gradeScore
        };
    })
}

const WeeklyOverallGrade = (props) =>{
    const data = props.data ? buildTableData(props.data) : null;
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

export default WeeklyOverallGrade;