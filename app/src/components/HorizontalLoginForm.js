import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as espnActions from '../actions/espnActions';
import * as _ from 'lodash';
import { Alert, Form, Icon, Input, Button, Steps, Card, Select, Result, Spin } from 'antd';
const { Option } = Select;
const { Step } = Steps;
const _src = `${process.env.PUBLIC_URL}/images/`;
const imageStyle = {
  maxWidth: 500,
  maxHeight: 300
}

const steps = [
  {
    title: 'Login',
    content: (
      <h3>Login to <a href="https://www.espn.com/fantasy/" target="_blank">https://www.espn.com/fantasy</a>.</h3>
    )
  },
  {
    title: 'Inspect',
    content: (
      <div>
        <h3>Right click to inspect.</h3>
        <img alt="inspect" style={imageStyle} src={`${_src}/inspect.png`}/>
      </div>
    )
  },
  {
    title: 'Applications',
    content: (
      <div>
        <h3>Click on 'Applictaions' tab</h3>
        <img alt="application" style={imageStyle} src={`${_src}/application.png`}/>
      </div>
    ),
  },
  {
    title: 'Cookies',
    content: (
      <div>
        <h3>Under Storage -> Cookies Folder -> Click on https://www.espn.com</h3>
        <img alt="cookies" style={imageStyle} src={`${_src}/cookies.png`}/>
      </div>
    ),
  },
  {
    title: 'SWID',
    content: (
      <div>
        <h3>1. Search for SWID key</h3>
        <h3>2. Copy Value and enter above (including brackets {"{}"})</h3>
        <img alt="search_swid" style={imageStyle} src={`${_src}/search_swid.png`}/>
      </div>
    )
  },
  {
    title: 'espn_s2',
    content: (
      <div>
        <h3>1. Search for espn_s2 key</h3>
        <h3>2. Copy Value and enter above</h3>
        <img alt="search_s2" style={imageStyle} src={`${_src}/search_s2.png`}/>
      </div>
    )
  },
  {
    title: 'League ID',
    content: (
      <div>
        <h3>Go to your fantasy team page.</h3>
        <h3>Find leagueId in the URL (Web Address).</h3>
        <h3>Enter leagueId above.</h3>
        <img alt="league_id" style={imageStyle} src={`${_src}/league_id.png`}/>
      </div>
    )
  },
  {
    title: 'Submit',
    content: (
      <div>
        Click 'Submit'.
      </div>
    )
  }
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends Component {
  constructor(props){
    super();
    this.state = {
      isLoading: false,
      current: 0,
      fields: {
        leagueId: {
          value: ''
        },
        SWID: {
          value: ''
        },
        espnS2: {
          value: ''
        }
      }
    };
  }

  componentDidMount() {
    this.props.espnActions.getESPNUser().then(espnUserDataRes => {
    }).catch(espnUserErr => {
      console.log(espnUserErr);
    });
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.user && this.props.user.cookies !== prevProps.user.cookies){
      this.setState({
        fields: {
          leagueId: {
            value: this.props.user.cookies.leagueId || ""
          },
          SWID: {
            value: this.props.user.cookies.SWID || ""
          },
          espnS2: {
            value: this.props.user.cookies.espnS2 || ""
          }
        }
      });
    }
  }

  handleSubmit = (values) => {
    this.props.espnActions.setCookies(values);
    this.setState({
      isLoading: true
    });
    this.props.espnActions.getLeagueData()
        .then(leagueDataRes => {
            this.setState({
              isLoading: false,
              isLoginResult: true,
              isLoginSuccess: true
            });
        }).catch(leagueInfoErr => {
          this.setState({
            isLoading: false,
            isLoginResult: true,
            isLoginSuccess: false
          });
        })
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleSelectChange = (value) => {
    if(this.props.user.cookies.leagueId !== value){
      let cookieClone = _.cloneDeep(this.props.user.cookies);
      cookieClone.leagueId = value;
      this.handleSubmit(cookieClone);
    }
  }

  handleSuccessReportClick = () => {
    this.props.history.push(`/report/${this.props.user.cookies.leagueId}`)
  }

  handleShowStepsClick = () => {
    this.setState({
      isLoginResult: false
    });
  }

  render() {
    const { fields } = this.state;
    const { current } = this.state;
    const _dropdown = this.props.user && this.props.user.espnUser ? this.props.user.espnUser.leaguesModel : null;
    const _defaultDropDown = _dropdown ? _.find(this.props.user.espnUser.leaguesModel, {'value': parseInt(this.props.user.cookies.leagueId)}) || {} : null;

    return (
      <div>
        {_dropdown ? 
            <div>
              <label>Default Team: </label>
              <Select defaultValue={_defaultDropDown.label} style={{ width: 400, marginTop: 25 }} onChange={this.handleSelectChange}>
                {
                  _.map(_dropdown, team => {
                    return (
                      <Option disabled={team.value == this.props.user.cookies.leagueId} key={team.value} value={team.value}>{team.label}</Option>
                    )
                  })
                }
              </Select>
          </div>
        : null}

        <Spin spinning={this.state.isLoading} >
          <Card style={{margin: '25px 0', textAlign: 'center'}}>
            <WrappedHorizontalLoginForm {...fields} onChange={this.handleFormChange} onSubmit={this.handleSubmit}></WrappedHorizontalLoginForm>
          </Card>
        </Spin>

        <div style={{width: '50%', margin: '0 auto'}}>
          <Alert
            message="Connecting to ESPN Private League Info"
            description={`ESPN does not have a direct login, you need to enter two values to connect to your private leagues. Please follow the steps below. *Note - if you are in multiple leagues, you ONLY need to change the leagueId to see other league results.`}
            type="info"
            showIcon
          />
        </div>


        <Card style={{marginTop: 25}}>
          {!this.state.isLoginResult ?
            <div>
              <div className="steps-action" style={{padding: 10, textAlign: 'center'}}>
                {current > 0 && (
                  <Button style={{ marginRight: 10 }} onClick={() => this.prev()}>
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={() => this.next()}>
                    Next
                  </Button>
                )}
              </div>
              <Steps current={current}>
                {steps.map(item => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content">{steps[current].content}</div>
            </div>
          :
            <Result
                status={this.state.isLoginSuccess ? 'success' : 'error'}
                title={this.state.isLoginSuccess ? 'Successfully Logged ESPN Fantasy Sports!' : 'Submission Failed.'}
                subTitle={this.state.isLoginSuccess ? `Your League and team: ${_defaultDropDown.label}.` : 'Please check and modify the following information SWID, espnS2, leagueId.'}
                extra={[
                  this.state.isLoginSuccess ? 
                  <Button onClick={this.handleSuccessReportClick} type="primary" key="report">
                    Report Card
                  </Button> : null,
                  <Button onClick={this.handleShowStepsClick} key="steps">Show Steps</Button>,
                ]}
              />
          }
        </Card>
      </div>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create({ 
  name: 'horizontal_login',
  onSubmit(props, values) {
    props.form.validateFields((err, values) => {
      props.onSubmit((err, values));
    })
  },
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      leagueId: Form.createFormField({
        ...props.leagueId,
        value: props.leagueId.value,
      }),
      SWID: Form.createFormField({
        ...props.SWID,
        value: props.SWID.value,
      }),
      espnS2: Form.createFormField({
        ...props.espnS2,
        value: props.espnS2.value,
      }),
    };
  },
})(props => {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, validateFields } = props.form;
    const leageIdError = isFieldTouched('leagueId') && getFieldError('leagueId');
    const swidError = isFieldTouched('SWID') && getFieldError('SWID');
    const espnS2Error = isFieldTouched('espnS2') && getFieldError('espnS2');
    const onSubmit = (e) => {
      e.preventDefault();

      validateFields((err, values) => {
          if (!err) {
              props.onSubmit(values); // call the parent submit
          }
      });
    };
    return (
      <Form layout="inline" onSubmit={onSubmit}>
          <Form.Item label="SWID" validateStatus={swidError ? 'error' : ''} help={swidError || ''}>
            {getFieldDecorator('SWID', {
              rules: [{ required: true, message: 'Please input your SWID cookie!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="SWID"
              />,
            )}
          </Form.Item>
          <Form.Item label="espn_s2" validateStatus={espnS2Error ? 'error' : ''} help={espnS2Error || ''}>
            {getFieldDecorator('espnS2', {
              rules: [{ required: true, message: 'Please input your espnS2 cookie!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="espnS2"
              />,
            )}
          </Form.Item>
          <Form.Item label="leagueId" validateStatus={leageIdError ? 'error' : ''} help={leageIdError || ''}>
            {getFieldDecorator('leagueId', {
              rules: [{ required: true, message: 'Please input your leagues Id!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="LeagueId"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Submit
            </Button>
          </Form.Item>
        </Form>
    )
});

function mapStateToProps(state, ownProps){
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch){
 return {
   espnActions: bindActionCreators(espnActions, dispatch)
 };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HorizontalLoginForm));
