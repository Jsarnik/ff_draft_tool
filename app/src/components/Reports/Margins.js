import React from 'react';
import * as _ from 'lodash';
import TeamLogo from '../TeamLogo';
import { Table, Divider } from 'antd';
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
                                    <div className="list-table-item left" style={{width:'80%'}}>Team</div>
                                    <div className="list-table-item right" style={{width:'20%'}}>Pts</div>
                                </div> 
                                }
                    />
                    <Card.Body>
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'80%'}}><div><TeamLogo size={20} src={team.team_logo} /><span>{team.team}</span></div></div>
                            <div className="list-table-item right" style={{width:'20%'}}>{team.team_pts}</div>
                        </div> 
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'80%'}}><div><TeamLogo size={20} src={team.opp_logo} /><span>{team.opp}</span></div></div>
                            <div className="list-table-item right" style={{width:'20%'}}>{team.opp_pts}</div>
                        </div>
                        <Divider></Divider>
                        <div style={{marginTop: 10}}>
                            <div className="list-table-item left" style={{width:'80%', fontWeight: "bold"}}>Margin</div>
                            <div className="list-table-item right" style={{width:'20%'}}>
                            <span style={parseFloat(team.margin) > 0 ?  {color: "#3f8600", fontWeight: "bold"} : parseFloat(team.margin) === 0 ? {} : {color: "#cf1322", fontWeight: "bold"}}>{team.margin.toFixed(2)}</span>
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
        <div>
            {props.isMobile ?
                <MobileTable data={data}></MobileTable>
            :
                <Table columns={columns} dataSource={data} bordered pagination={false}/>
            }
        </div>
    ) : null
}

export default Margins;