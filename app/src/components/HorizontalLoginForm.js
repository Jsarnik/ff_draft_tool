import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { Form, Icon, Input, Button, Steps, Card } from 'antd';

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
      <div>Login to <a href="https://www.espn.com/fantasy/" target="_blank">https://www.espn.com/fantasy</a>.</div>
    )
  },
  {
    title: 'Inspect',
    content: (
      <div>
        <div>Right click to inspect.</div>
        <img alt="inspect" style={imageStyle} src={`${_src}/inspect.png`}/>
      </div>
    )
  },
  {
    title: 'Applications',
    content: (
      <div>
        <div>In console, go to Applictaions tab</div>
        <img alt="application" style={imageStyle} src={`${_src}/application.png`}/>
      </div>
    ),
  },
  {
    title: 'Cookies',
    content: (
      <div>
        <div>Go to Storage -> Cookies Folder -> https://www.espn.com</div>
        <img alt="cookies" style={imageStyle} src={`${_src}/cookies.png`}/>
      </div>
    ),
  },
  {
    title: 'SWID',
    content: (
      <div>
        <div>1. Search for SWID key</div>
        <div>2. Copy Value and enter below (including brackets {"{}"})</div>
        <img alt="search_swid" style={imageStyle} src={`${_src}/search_swid.png`}/>
      </div>
    )
  },
  {
    title: 'espn_s2',
    content: (
      <div>
        <div>1. Search for espn_s2 key</div>
        <div>2. Copy Value and enter below</div>
        <img alt="search_s2" style={imageStyle} src={`${_src}/search_s2.png`}/>
      </div>
    )
  },
  {
    title: 'League ID',
    content: (
      <div>
        Find league ID here
        <img alt="league_id" style={imageStyle} src={`${_src}/league_id.png`}/>
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
    this.getCookies();
  }

  getCookies = () => {
    let cookieArray = document.cookie.split(';'),
    fields ={};

    _.each(cookieArray, cookie => {
        let [key, value] = cookie.split('=');
        fields[key.trim()] = value;
    });

    this.setState({
      fields: {
        leagueId: {
          value: fields.leagueId || ""
        },
        SWID: {
          value: fields.SWID || ""
        },
        espnS2: {
          value: fields.espnS2 || ""
        }
      }
    });
  }

  handleSubmit = (values) => {
    _.each(values, (val, key) => {
      document.cookie = `${key}=${val}`;
    });
    this.props.history.push(`/${this.props.match.params.redirect || 'report'}`);
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

  render() {
    const { fields } = this.state;
    const { current } = this.state;

    return (
      <div style={{marginTop: 50}}>
        <Steps current={current}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          )}
        </div>
        <Card>
          <WrappedHorizontalLoginForm {...fields} onChange={this.handleFormChange} onSubmit={this.handleSubmit}></WrappedHorizontalLoginForm>
        </Card>
      </div>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create({ 
  name: 'horizontal_login',
  onSubmit(props, values) {
    console.log(values)
    props.form.validateFields((err, values) => {
      props.onSubmit((err, values));
    })
  },
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    console.log(props)
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
          console.log('Received values of form: ', values);
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

export default withRouter(HorizontalLoginForm);
