import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as espnActions from '../actions/espnActions';
import TotalPoints from './Reports/TotalPoints';
import PointsOnBench from './Reports/PointsOnBench';
import Margins from './Reports/Margins';
import RankChange from './Reports/RankChange';
import PointsChange from './Reports/PointsChange';
import WeeklyOverallGrade from './Reports/WeeklyOverallGrade';
import * as _ from 'lodash';
import { MobileDropDown, MobileReport } from './Mobile/MobileReportCard';
import { Tabs, Select, Card, Spin, Row, Col } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;


const PeriodDropDown = (props) =>{
  return (
    <div>
      <Select defaultValue={`Week ${props.currentPeriod} (Current)`} style={{ width: '100%' }} onChange={props.handleSelectPeriodChange}>
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

class SnapShot extends Component {
    constructor(props) {
      super(props)
      this.state = {
        report: null,
        selectedReport: 'total_pts',
        isloading: false
      }
    }

    componentDidMount = () => {
        if(this.props.match.params.leagueId && this.props.match.params.swid && this.props.match.params.espns2){
          const cookieObj = {
            leagueId: this.props.match.params.leagueId,
            SWID: this.props.match.params.swid,
            espnS2: this.props.match.params.espns2
          }
          this.setState({cookieObj: cookieObj}, (err) => {this.getLeagueData(null); });
      }
    }

    getLeagueData = (_currentMatchupPeriod) => {
      this.setState({
        isloading: true
      });

      this.props.espnActions.getLeagueData(_currentMatchupPeriod, this.state.cookieObj)
        .then(leagueDataRes => {
            this.setState({
              isloading: false,
              viewingCurrentMatchupPeriod: _currentMatchupPeriod || leagueDataRes.leagueInfo.status.currentMatchupPeriod
            });
        }).catch(leagueInfoErr => {
          this.setState({
            isloading: false
          });
        })
    }

    handleTabChange = (val) =>{
      this.props.history.push(`/snapshot/${this.props.match.params.swid}/${this.props.match.params.espns2}/${this.props.match.params.leagueId}}/${val}`);
    }

    handleSelectPeriodChange = (period) => {
      if(this.state.viewingCurrentMatchupPeriod !== period){
        this.getLeagueData(period);
      }
    }

    handleReportChange = (val) => {
      this.setState({
        selectedReport: val
      })
    }

    renderMobileReport = (val) =>{
      switch(val){
        case 'total_pts':
          return (<TotalPoints isMobile={true} data={this.props.espn.report.stats}></TotalPoints>);
        case 'margins':
          return (<Margins isMobile={true} data={this.props.espn.report.stats}></Margins>)
        case 'benched_pts':
          return (<PointsOnBench isMobile={true} data={this.props.espn.report.stats}></PointsOnBench>)
        case 'weekly_diff':
          return (<PointsChange isMobile={true} data={this.props.espn.report.stats}></PointsChange>)
        case 'rank_change':
          return (<RankChange isMobile={true} data={this.props.espn.report.stats}></RankChange>)
        default:
          return (<div>Select Report Type</div>)
        
      }
    }
    
    render() {
      const _colSpan = this.props.isMobile ? 24 : 8;
      const _defaultPeriod = this.props.espn.report ? this.props.espn.report.leagueInfo.status.currentMatchupPeriod : 1;
      const _mobileDropdown = [
        {label: 'Total Points', value: 'total_pts'},
        {label: 'Win/Loss Margin', value: 'margins'},
        {label: 'Points Left On Bench', value: 'benched_pts'},
        {label: 'Weekly Pts Diff', value: 'weekly_diff'},
        {label: 'Projected Rank Change', value: 'rank_change'}
      ];

      return this.props.espn.report ? (
        <div>
          <div style={{textAlign: 'center', padding: 20}}>
            <h1>{this.props.espn.report.leagueInfo.settings.name} - Week {_defaultPeriod} Matchups</h1>
          </div>

        {
          this.props.isMobile ?
            <div>
                <Row style={{marginBottom: 20}}>
                  <Col span={_colSpan}>
                    <PeriodDropDown handleSelectPeriodChange={this.handleSelectPeriodChange} totalPeriods={this.props.espn.report.leagueInfo.settings.scheduleSettings.matchupPeriods} currentPeriod={_defaultPeriod}></PeriodDropDown>
                  </Col>
                </Row>
                <Row style={{marginBottom: 20}}>
                  <Col span={_colSpan}>
                      <MobileDropDown handleReportChange={this.handleTabChange} selectedReport={this.props.match.params.type || 'weekly_grade'}></MobileDropDown>
                  </Col>
                </Row>
            </div>
          :
            <Row style={{marginBottom: 20}}>
              <Col span={_colSpan}>
                <PeriodDropDown handleSelectPeriodChange={this.handleSelectPeriodChange} totalPeriods={this.props.espn.report.leagueInfo.settings.scheduleSettings.matchupPeriods} currentPeriod={_defaultPeriod}></PeriodDropDown>
              </Col>
              <Col span={_colSpan}></Col>
            </Row>
          }
          <Spin spinning={this.state.isloading}>
            {
              this.props.isMobile ?
                <MobileReport data={this.props.espn.report.stats} selectedReport={this.props.match.params.type || 'weekly_grade'}></MobileReport>
              :
                <Card>
                  <Tabs defaultActiveKey={this.props.match.params.type || 'weekly_grade'} onChange={this.handleTabChange}>
                    <TabPane tab="Weekly Grade" key="weekly_grade">
                      <WeeklyOverallGrade data={this.props.espn.report.stats}></WeeklyOverallGrade>
                    </TabPane>
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
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SnapShot));