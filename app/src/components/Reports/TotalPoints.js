import React from 'react';
import * as _ from 'lodash';
import { Table } from 'antd';
import TeamLogo from '../TeamLogo';
import { WhiteSpace, Card} from 'antd-mobile';

const MobileTable = (props) => {
        return (
            <Card>
                <Card.Header
                    title={
                        <div  style={{width:'100%'}}>
                            <div className="list-table-item left" style={{width:'80%'}}>Team</div>
                            <div className="list-table-item right" style={{width:'20%'}}>Pts</div>
                        </div> 
                    }
                />
                <Card.Body>
                    {
                        _.map(props.data, team=>{
                            return (
                                <div style={{width: '100%', paddingTop: 10, paddingBottom: 10}} key={team.key}>
                                    <div className="list-table-item left" style={{width: '80%'}}><TeamLogo size={20} src={team.team_logo} /><span>{team.team}</span></div>
                                    <div className="list-table-item right" style={{width: '20%'}}>{team.pts}</div>
                                </div> 
                            )
                        })
                    }
                </Card.Body>
            </Card>
        )
}

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
        <div>
            {props.isMobile ?
                <MobileTable data={data}></MobileTable>
            :
                <Table columns={columns} dataSource={data} bordered pagination={false}/>
            }
        </div>
    ) : null
}

export default TotalPoints;