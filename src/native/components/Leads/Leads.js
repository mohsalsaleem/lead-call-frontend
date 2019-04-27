import React, { Component } from 'react';
import { StyleSheet, Platform, Linking, AppState, Alert, Modal,TouchableHighlight } from 'react-native';
import {
  Container, Content, Text, H1, H2, H3, View, Button, DeckSwiper
} from 'native-base';
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux';

import Lead from './Lead'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white"
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent"
  }
});

let leads = []
for (let i = 0; i < 10; i++) {
  lead = {
    name: 'Vishwanath ' + i,
    phone: '+91950011210',
    interestScore: 10.4,
    qanda: [
      {
        question: 'Who is the President of India?',
        answer: 'Modi Ji'
      },
      {
        question: 'Who is the President of India?',
        answer: 'Modi Ji'
      },
      {
        question: 'Who is the President of India?',
        answer: 'Modi Ji'
      },
      {
        question: 'Who is the President of India?',
        answer: 'Modi Ji'
      }
    ]
  }
  leads.push(lead)
}

const onSwipeLeft = (data) => {
  console.log({ data })
}

const onSwipeRight = (data) => {
  const dataString = JSON.stringify(data);
  AsyncStorage.setItem('lastDialledLead', dataString)
  Linking.openURL(`tel:${data.phone}`)
}

class Leads extends Component {

  state = {
    appState: AppState.currentState,
    modalVisible: false,
    modalContent: undefined
  };

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  swipeLeft = () => {
    this._deckSwiper._root.swipeLeft()
  }

  showLastDialledLeadForm = async () => {
    const value = await AsyncStorage.getItem('lastDialledLead')
    const data = JSON.parse(value)

    this.setState({
      modalVisible: true,
      modalContent: data
    })
  }

  clearLastDialledLead = async() => {
    await AsyncStorage.removeItem('lastDialledLead')
  }

  hideModal = () => {
    this.clearLastDialledLead()
    this.setState({
      modalVisible: false
    })
  }

  _handleAppStateChange = (nextAppState) => {
    const component = this;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.showLastDialledLeadForm();
    }
    this.setState({appState: nextAppState});
  };

  render () {
    return (
      <Container style={styles.container}>
        <View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            >
            <Container padder>
              {
                this.state.modalContent ? 
                <Content>
                  <Text>Provide feedback about</Text>
                  <H1>{this.state.modalContent.name}</H1>
                  <Text>{this.state.modalContent.phone}</Text>
                  <Button onPress={() => {
                    this.hideModal();
                  }}>
                    <Text>Done</Text>
                  </Button>
                </Content> : null
              }
            </Container>
          </Modal>

          <DeckSwiper
            ref={ (c) => this._deckSwiper = c }
            dataSource={leads}
            renderItem={ item => <Lead data={item} onSwipeLeft={() => this.swipeLeft()} /> }
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
          />
        </View>
      </Container>
    )
  }
}

export default connect()(Leads);
