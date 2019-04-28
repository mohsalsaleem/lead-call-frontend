import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native'
import {
  Container, Content, Form, Item, Label, Input, Text, Button, View, Left, Right
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from '../UI/Messages';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';

class Login extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
    success: null,
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      email: (props.member && props.member.email) ? props.member.email : '',
      password: '',
      loggedIn: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    AsyncStorage.removeItem('business_id')
    AsyncStorage.removeItem('user_id')
    AsyncStorage.removeItem('role')
    AsyncStorage.removeItem('loggedIn')
    console.log('Verifying auth')
    AsyncStorage.getItem('loggedIn').then(response => {
      if (response === "true") {
        Actions.push('home')
      }
    })
  }

  handleChange = (name, val) => this.setState({ [name]: val })

  setLogin = async () => {
    try {
      await AsyncStorage.setItem('loggedIn', "true", (error) => {
        console.log('Error setting logged in status: ', error)
      })
    } catch(error) {
      console.log('Error setting logged in status: ', error)
    }
  }

  getLogin = async () => {
    let value = -1;
    try {
      value = await AsyncStorage.getItem('loggedIn').then(response => {
        console.log(response)
      })
    } catch(error) {
      console.log(error)
    }
    return value;
  }

  handleSubmit = () => {
    const { onFormSubmit } = this.props;
    const component = this;
    return onFormSubmit(this.state)
      .then((data) => {
        console.log(data);
        console.log('Logged in..')
        this.setLogin();
        Actions.replace('home')
      })
      .catch(() => {});
  }

  goToRegister = () => {
    Actions.SignUp()
  }

  render() {
    const { loading, error, success } = this.props;
    const { email } = this.state;

    return (
      <Container>
        <Content>
          <View padder>
            <Header
              title="Welcome to LeadCaller"
              content="Please use your mobile number and password to login."
            />
            {error && <Messages message={error} />}
            {success && <Messages type="success" message={success} />}
          </View>

          <Form>
            <Item stackedLabel>
              <Label>Phone Number</Label>
              <Input
                autoCapitalize="none"
                value={email}
                keyboardType="phone-pad"
                disabled={loading}
                onChangeText={v => this.handleChange('email', v)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry
                disabled={loading}
                onChangeText={v => this.handleChange('password', v)}
              />
            </Item>

            <Spacer size={20} />

            <View padder>
              <Button block onPress={this.handleSubmit} disabled={loading}>
                <Text>{loading ? 'Loading' : 'Login' }</Text>
              </Button>
            </View>
          </Form>

          <Spacer size={10} />

          <View padder>
            <Button block onPress={this.goToRegister} disabled={loading}>
                <Text>Register</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Login;
