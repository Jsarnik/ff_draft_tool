import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as espnActions from '../actions/espnActions';
import TotalPoints from './Reports/TotalPoints';
import PointsOnBench from './Reports//PointsOnBench';
import Margins from './Reports/Margins';
import RankChange from './Reports/RankChange';
import PointsChange from './Reports/PointsChange';
import * as _ from 'lodash';
import { Tabs, Select, Card, Spin, Row, Col } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;


const PeriodDropDown = (props) =>{
  return (
    <div>
      <Select defaultValue={`Week ${props.currentPeriod} (Current)`} style={{ width: 400 }} onChange={props.handleSelectPeriodChange}>
        {
          _.map(props.totalPeriods, period => {
            let val = period[0];
            return (
              <Option key={val} value={val} disabled={period > props.currentPeriod}>Week {val} {period < props.currentPeriod ? '(Ended)' : period == props.currentPeriod  ? '(Current)' : ''}</Option>
            )
          })
        }
      </Select>
    </div>
  )
}

class ReportCard extends Component {
    constructor(props) {
      super(props)
      this.state = {
        report: null,
        isloading: false
      }
    }

    componentDidMount = () => {
      this.props.espnActions.getESPNUser().then(espnUserDataRes => {
      }).catch(espnUserErr => {
        console.log(espnUserErr);
      });
    }

    componentDidUpdate = (prevProps) => {
      if(this.props.user && this.props.user.cookies !== prevProps.user.cookies){
        this.getLeagueData();
      }
    }

    getLeagueData = (_currentMatchupPeriod) => {
      this.setState({
        isloading: true
      });

      this.props.espnActions.getLeagueData(_currentMatchupPeriod)
        .then(leagueDataRes => {
          this.props.history.push(`/report/${this.props.match.params.leagueId || this.props.user.cookies.leagueId}`);
            this.setState({
              isloading: false,
              viewingCurrentMatchupPeriod: _currentMatchupPeriod || leagueDataRes.leagueInfo.status.currentMatchupPeriod
            });
        }).catch(leagueInfoErr => {
          this.props.history.push('/login/report');
          this.setState({
            isloading: false
          });
        })
    }

    handleTabChange = (val) =>{
      this.props.history.push(`/report/${this.props.match.params.leagueId}/${val}`);
    }

    handleLogin = () => {
      this.getLeagueData();
    }

    handleSelectChange = (value) => {
      if(this.props.user.cookies.leagueId !== value){
        let cookieClone = _.cloneDeep(this.props.user.cookies);
        cookieClone.leagueId = value;
        this.props.espnActions.setCookies(cookieClone);
        this.props.history.push(`/report/${value}`);
      }
    }

    handleSelectPeriodChange = (period) => {
      if(this.state.viewingCurrentMatchupPeriod !== period){
        this.getLeagueData(period);
      }
    }
    
    render() {
      const _dropdown = this.props.user && this.props.user.espnUser ? this.props.user.espnUser.leaguesModel : null;
      const _defaultDropDown = _dropdown ? _.find(this.props.user.espnUser.leaguesModel, {'value': parseInt(this.props.user.cookies.leagueId)}) || {} : null;
      const _defaultPeriod = this.props.espn.report ? this.props.espn.report.leagueInfo.status.currentMatchupPeriod : 1;

      return this.props.espn.report ? (
          <div>

            <Row>
              {_dropdown ? 
                <Col span={12}>
                  <Select defaultValue={_defaultDropDown.label} style={{ width: 400 }} onChange={this.handleSelectChange}>
                    {
                      _.map(_dropdown, team => {
                        return (
                          <Option key={team.value} value={team.value}>{team.label}</Option>
                        )
                      })
                    }
                  </Select>
                </Col>
              : null}
              <Col span={12}>
                <PeriodDropDown handleSelectPeriodChange={this.handleSelectPeriodChange} totalPeriods={this.props.espn.report.leagueInfo.settings.scheduleSettings.matchupPeriods} currentPeriod={_defaultPeriod}></PeriodDropDown>
              </Col>
            </Row>

            <Spin spinning={this.state.isloading}>
              <div style={{textAlign: 'center', padding: 20}}>
                <h1>{this.props.espn.report.leagueInfo.settings.name} - Week {_defaultPeriod} Matchups</h1>
              </div>
              <Card>
                <Tabs defaultActiveKey={this.props.match.params.type || 'total_pts'} onChange={this.handleTabChange}>
                  <TabPane tab="Total Points" key="total_pts">
                    <TotalPoints data={this.props.espn.report.stats}></TotalPoints>
                  </TabPane>
                  <TabPane tab="Win/Loss Margin" key="margins">
                    <Margins data={this.props.espn.report.stats}></Margins>
                  </TabPane>
                  <TabPane tab="Points Left On Bench" key="benched_pts">
                    <PointsOnBench data={this.props.espn.report.stats}></PointsOnBench>
                  </TabPane>
                  <TabPane tab="Weekly Pts Diff" key="weekly_diff">
                    <PointsChange data={this.props.espn.report.stats}></PointsChange>
                  </TabPane>
                  <TabPane tab="Proj Rank Change" key="rank_change">
                    <RankChange data={this.props.espn.report.stats}></RankChange>
                  </TabPane>
                </Tabs>
              </Card>
            </Spin>
        </div>
      ) : null
    }
}

function mapStateToProps(state, ownProps){
  return {
    user: state.user,
    espn: state.espn
  };
}

function mapDispatchToProps(dispatch){
 return {
   espnActions: bindActionCreators(espnActions, dispatch)
 };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportCard));