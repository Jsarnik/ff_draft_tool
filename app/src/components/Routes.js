import React from 'react';
import {BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HorizontalLoginForm from './HorizontalLoginForm';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { Layout } from 'antd';
import DraftLayout from './DraftLayout';
import ReportCard from './ReportCard';
import SnapShot from './SnapShot';
import CookiesAlertBar from './CookiesAlertBar';

const {Content, Footer } = Layout;

const Routes = (props) => {
    const _isMobile = props.isMobile;
    return (
        <BrowserRouter>
            <Layout style={{minHeight:"100vh"}}>
                {props.isMobile ? <MobileMenu /> : <Navigation /> }
                <Content style={{ padding: props.isMobile ? '0 25px ' : '0 50px', marginTop: 30 }}>
                  <CookiesAlertBar></CookiesAlertBar>
                  <div className="content" style={{}}>
                      <Switch>
                          <Route exact path="/" render={(props) => <HorizontalLoginForm {...props}/>} />
                          <Route exact path="/login/:redirect?" render={(props) => <HorizontalLoginForm {...props}/>} />
                          <Route exact path="/draft" render={(props) => <DraftLayout {...props}/>} />
                          <Route path="/report/:leagueId?/:type?" render={(props) => <ReportCard {...props} isMobile={_isMobile}/>} />
                          <Route path="/snapshot/:swid/:espns2/:leagueId/:type?" render={(props) => <SnapShot {...props} isMobile={_isMobile}/>} />
                          <Redirect to="/" />
                      </Switch>
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center', padding: 0}}>ESPN Fantasy Tools ©2019 created by SarnikDev</Footer>
            </Layout>
        </BrowserRouter>
    )
};

export default Routes;