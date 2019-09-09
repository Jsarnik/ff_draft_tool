import React from 'react';
import TotalPoints from '../Reports/TotalPoints';
import PointsOnBench from '../Reports/PointsOnBench';
import Margins from '../Reports/Margins';
import RankChange from '../Reports/RankChange';
import PointsChange from '../Reports/PointsChange';
import WeeklyOverallGrade from '../Reports/WeeklyOverallGrade'
import * as _ from 'lodash';
import { Select } from 'antd';
const { Option } = Select;

const MobileReport = (props) =>{
    switch(props.selectedReport){
      case 'weekly_grade':
        return (<WeeklyOverallGrade isMobile={true} data={props.data}></WeeklyOverallGrade>)
      case 'total_pts':
        return (<TotalPoints isMobile={true} data={props.data}></TotalPoints>);
      case 'margins':
        return (<Margins isMobile={true} data={props.data}></Margins>)
      case 'benched_pts':
        return (<PointsOnBench isMobile={true} data={props.data}></PointsOnBench>)
      case 'weekly_diff':
        return (<PointsChange isMobile={true} data={props.data}></PointsChange>)
      case 'rank_change':
        return (<RankChange isMobile={true} data={props.data}></RankChange>)
      default:
        return (<div>Select Report Type</div>) 
    }
}

const MobileDropDown = (props) => {
    const _mobileDropdown = [
        {label: 'Weekly Grade', value: 'weekly_grade'},
        {label: 'Total Points', value: 'total_pts'},
        {label: 'Win/Loss Margin', value: 'margins'},
        {label: 'Points Left On Bench', value: 'benched_pts'},
        {label: 'Weekly Pts Diff', value: 'weekly_diff'},
        {label: 'Projected Rank Change', value: 'rank_change'}
      ];

      return (
        <Select defaultValue={'Weekly Grade'} style={{ width: '100%', marginTop: 20 }} onChange={props.handleReportChange}>
            {
            _.map(_mobileDropdown, report => {
                return (
                <Option key={report.value} value={report.value} disabled={report.value === props.selectedReport}>{report.label}</Option>
                )
            })
            }
        </Select>
      )
}
  
export {
    MobileDropDown,
    MobileReport,
  }