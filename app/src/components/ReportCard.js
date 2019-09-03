import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import config from '../globals';
import axios from 'axios';
import * as _ from 'lodash';
import { Tabs, Spin, Card, Icon, Avatar, Empty } from 'antd';

const { TabPane } = Tabs;

const TotalPoints = (props) =>{
  const gridStyle1 = {
    width: '70%',
    textAlign: 'left',
  },
  gridStyle2 = {
    width: '30%',
    textAlign: 'right',
  };
  return (
    <div style={{ background: '#ECECEC', padding: '30px' }}>
      <Card title="">
        <Card.Grid style={gridStyle1}>TEAM</Card.Grid>
        <Card.Grid style={gridStyle2}>TOTAL POINTS</Card.Grid>
        {
          _.map(_.orderBy(props.stats, ['totalPts'], ['desc']), t => {
            return (
              <div>
                <Card.Grid style={gridStyle1}>
                  <Avatar size={15} src={t.info.logo} />
                  <span> {t.info.location} {t.info.nickname} ({t.info.abbrev})</span>
                 </Card.Grid>
                <Card.Grid style={gridStyle2}>{t.totalPts}</Card.Grid>
              </div>
            )
          })
        }
      </Card>
    </div>
  )
}

const Margins = (props) =>{
  const gridStyle1 = {
    width: '35%',
    textAlign: 'left',
  },
  gridStyle2 = {
    width: '10%',
    textAlign: 'right',
  };

  return (
    <div style={{ background: '#ECECEC', padding: '30px' }}>
      <Card title="">
        <Card.Grid style={gridStyle1}>TEAM</Card.Grid>
        <Card.Grid style={gridStyle2}>(PTS)</Card.Grid>
        <Card.Grid style={gridStyle1}>OPPONENT</Card.Grid>
        <Card.Grid style={gridStyle2}>(PTS)</Card.Grid>
        <Card.Grid style={gridStyle2}>MARGIN</Card.Grid>
        {
          _.map(_.orderBy(props.stats, ['margin'], ['desc']), t => {
            const opp = props.stats[t.oppId];
            return (
              <div>
                <Card.Grid style={gridStyle1}>
                  <Avatar size={15} src={t.info.logo} />
                  <span> {t.info.location} {t.info.nickname} ({t.info.abbrev})</span>
                </Card.Grid>
                <Card.Grid style={gridStyle2}>
                  <span>{t.totalPts}</span>
                </Card.Grid>
                <Card.Grid style={gridStyle1}>
                  <Avatar size={15} src={opp.info.logo} />
                  <span> {opp.info.location} {opp.info.nickname} [{opp.info.abbrev}]</span> 
                </Card.Grid>
                <Card.Grid style={gridStyle2}>
                  <span>{opp.totalPts}</span> 
                </Card.Grid>
                <Card.Grid style={gridStyle2}>
                  <span style={t.margin > 0 ?  {color: "#3f8600"} : t.margin === 0 ? {} : {color: "#cf1322"}}>{t.margin.toFixed(2)}</span>
                </Card.Grid>
              </div>
            )
          })
        }
      </Card>
    </div>
  )
}

const PointsOnBench = (props) =>{
  const gridStyle1 = {
    width: '70%',
    textAlign: 'left',
  },
  gridStyle2 = {
    width: '30%',
    textAlign: 'right',
  };
  return (
    <div style={{ background: '#ECECEC', padding: '30px' }}>
      <Card title="">
        <Card.Grid style={gridStyle1}>TEAM</Card.Grid>
        <Card.Grid style={gridStyle2}>PTS LEFT ON BENCH</Card.Grid>
        {
          _.map(_.orderBy(props.stats, ['ptsLeftOnBench'], ['desc']), t => {
            const opp = props.stats[t.oppId];
            return (
              <div>
                <Card.Grid style={gridStyle1}>
                  <Avatar size={15} src={t.info.logo} />
                  <span> {t.info.location} {t.info.nickname} ({t.info.abbrev})</span>
                </Card.Grid>
                <Card.Grid style={gridStyle2}>
                  <span>{t.ptsLeftOnBench.toFixed(2)}</span> 
                </Card.Grid>
              </div>
            )
          })
        }
      </Card>
    </div>
  )
}

const PointChange = (props) =>{
  const gridStyle1 = {
    width: '40%',
    textAlign: 'left',
  },
  gridStyle2 = {
    width: '20%',
    textAlign: 'right',
  };

  return props.stats[Object.keys(props.stats)[0]].previous ? (
    <div style={{ background: '#ECECEC', padding: '30px' }}>
      <Card title="">
        <Card.Grid hoverable={false} style={gridStyle1}>TEAM</Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle2}>PREVIOUS WEEK (PTS)</Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle2}>CURRENT WEEK (PTS)</Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle2}>CHANGE</Card.Grid>
        {
          _.map(_.orderBy(props.stats, [(o) => { return o.previous.score }]), t => {
            return (
              <div>
                <Card.Grid hoverable={false} style={gridStyle1}>
                  <Avatar size={15} src={t.info.logo} />
                  <span> {t.info.location} {t.info.nickname} ({t.info.abbrev})</span>
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle2}>
                  <span>{t.previous.score}</span> 
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle2}>
                  <span>{t.totalPts}</span> 
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle2}>
                  <span style={t.previous.diff > 0 ?  {color: "#3f8600"} :  {color: "#cf1322"}}>
                    {t.previous.diff > 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />}
                    <span> {Math.abs(t.previous.diff).toFixed(2)}</span>
                  </span>
                </Card.Grid>
              </div>
            )
          })
        }
      </Card>
    </div>
  ) : <Empty />
}

const RankChange = (props) =>{
  const gridStyle1 = {
    width: '40%',
    textAlign: 'left',
  },
  gridStyle2 = {
    width: '20%',
    textAlign: 'right',
  },
  _order = _.orderBy(props.stats, [(o) => { return o.info.currentProjectedRank; }]);

  return (
    <div style={{ background: '#ECECEC', padding: '30px' }}>
      <Card title="">
        <Card.Grid hoverable={false} style={gridStyle1}>TEAM</Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle2}>DRAFT PROJ. RANK</Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle2}>CURRENT PROJ. RANK</Card.Grid>
        <Card.Grid hoverable={false} style={gridStyle2}>CHANGE</Card.Grid>
        {
          _.map(_order, t => {
            const _change = t.info.draftDayProjectedRank - t.info.currentProjectedRank;
            return (
              <div>
                <Card.Grid hoverable={false} style={gridStyle1}>
                  <Avatar size={15} src={t.info.logo} />
                  <span> {t.info.location} {t.info.nickname} ({t.info.abbrev})</span>
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle2}>
                  <span>{t.info.draftDayProjectedRank}</span> 
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle2}>
                  <span>{t.info.currentProjectedRank}</span> 
                </Card.Grid>
                <Card.Grid hoverable={false} style={gridStyle2}>
                    <span style={_change > 0 ?  {color: "#3f8600"} : _change === 0 ? {} : {color: "#cf1322"}}>
                      <span>
                        <span> {_change > 0 ? <Icon type="arrow-up" /> : _change === 0 ? <Icon type="line" /> : <Icon type="arrow-down" />} </span>
                        <span>{Math.abs(_change).toFixed(0)} </span>
                      </span>
                    </span>
                </Card.Grid>
              </div>
            )
          })
        }
      </Card>
    </div>
  )
}

class ReportCard extends Component {
    constructor(props) {
      super(props);
        this.state = {
          report: null  
        }
    }

    componentDidMount = () => {
      this.getLeagueData();
    }

    getLeagueData = () => {
      const cookies = this.getCookies();
      const url = `${config.baseApiUri}/api/weeklyReportCard`,
      options = {
          leagueId: this.props.match.params.leagueId || cookies.leagueId,//565418,
          cookies:{
              espnS2: cookies.espnS2,
              SWID: cookies.SWID
          }
      };
    
      this.setState({
        isloading: true
      })
      axios.post(url, options)
      .then(res => {
          if(res.data.failed){
            this.props.history.push('/login/report');
          }else{
            this.props.history.push(`/report/${this.props.match.params.leagueId || cookies.leagueId}`);
            this.setState({
              isloading: false,
              report: res.data
            })
          }
      }).catch(e => {
          console.log(e)
          this.setState({
            isloading: false
          })
          this.props.history.push('/login/report');
      });
    }

    handleTabChange = (val) =>{
      this.props.history.push(`/report/${this.props.match.params.leagueId}/${val}`);
    }

    getCookies = () => {
      let cookieArray = document.cookie.split(';'),
      cookieObject = {};
      
      _.each(cookieArray, cookie => {
          let [key, value] = cookie.split('=');
          cookieObject[key.trim()] = value;
      
      });
      return cookieObject;
    }

    handleLogin = () => {
      this.getLeagueData();
    }
    
    render() {
      console.log(this.state.report)
      return this.state.report ? (
        <div>
          <Card style={{textAlign: 'center'}}>
            <h1>{this.state.report.leagueInfo.settings.name} - Week {this.state.report.leagueInfo.scoringPeriodId} Matchups</h1>
          </Card>
          <Card>
            <Tabs defaultActiveKey={this.props.match.params.type || 'total_pts'} onChange={this.handleTabChange}>
              <TabPane tab="Total Points" key="total_pts">
                <TotalPoints stats={this.state.report.stats}></TotalPoints>
              </TabPane>
              <TabPane tab="Win/Loss Margin" key="margins">
                <Margins stats={this.state.report.stats}></Margins>
              </TabPane>
              <TabPane tab="Points Left On Bench" key="benched_pts">
                <PointsOnBench stats={this.state.report.stats}></PointsOnBench>
              </TabPane>
              <TabPane tab="Weekly Pts Diff" key="weekly_diff">
                <PointChange stats={this.state.report.stats}></PointChange>
              </TabPane>
              <TabPane tab="Proj Rank Change" key="rank_change">
                <RankChange stats={this.state.report.stats}></RankChange>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      ) : null
    }
}

export default withRouter(ReportCard);
