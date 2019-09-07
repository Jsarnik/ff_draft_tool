import React from 'react';
import {BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HorizontalLoginForm from './HorizontalLoginForm';
import Navigation from './Navigation';
import { Layout } from 'antd';
import DraftLayout from './DraftLayout';
import ReportCard from './ReportCard';
import CookiesAlertBar from './CookiesAlertBar';

const {Content, Footer } = Layout;

const Routes = (props) => {
    return (
        <BrowserRouter>
            <Layout style={{minHeight:"100vh"}}>
                <Navigation />
                <Content style={{ padding: '0 50px', marginTop: 30 }}>
                  <CookiesAlertBar></CookiesAlertBar>
                  <div className="content" style={{}}>
                      <Switch>
                          <Route exact path="/" render={(props) => <HorizontalLoginForm {...props}/>} />
                          <Route exact path="/login/:redirect?" render={(props) => <HorizontalLoginForm {...props}/>} />
                          <Route exact path="/draft" render={(props) => <DraftLayout {...props}/>} />
                          <Route path="/report/:leagueId?/:type?" render={(props) => <ReportCard {...props}/>} />
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