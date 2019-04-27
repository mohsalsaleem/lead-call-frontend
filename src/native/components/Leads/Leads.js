import React, { Component } from 'react';
import { StyleSheet, Platform, Linking, AppState, Alert, Modal,TouchableHighlight } from 'react-native';
import {
  Container, Content, Text, H1, H2, H3, View, Button, DeckSwiper, Item, Picker, Textarea, Spacer
} from 'native-base';
import { AsyncStorage } from 'react-native'
import { connect } from 'react-redux';

import Lead from './Lead'
import FeedBackModal from './FeedbackModal'

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
  },
  modalTitle: {
    justifyContent: 'center'
  }
});

let leads = []
for (let i = 0; i < 10; i++) {
  lead = {
    name: 'Vishwanath ' + i,
    phone: '+9195001121' + i,
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
    modalContent: undefined,
    leadFeedbackInterest: "not_selected",
    leadFeedbackComment: ""
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

  swipeLeft = () => {
    this._deckSwiper._root.swipeLeft()
  }

  showLastDialledLeadForm = async () => {
    const value = await AsyncStorage.getItem('lastDialledLead')
    const data = JSON.parse(value)

    this.setState({
      modalVisible: data !== null,
      modalContent: data
    })
  }

  clearLastDialledLead = async() => {
    await AsyncStorage.removeItem('lastDialledLead')
  }

  hideModal = () => {

    const feedBack = {
      user: this.state.modalContent,
      interestLevel: this.state.leadFeedbackInterest,
      comment: this.state.leadFeedbackComment
    }

    console.log({feedBack})

    this.clearLastDialledLead()
    this.setState({
      modalVisible: false
    })
  }

  leadFeedbackInterestChange = (value) => {
    this.setState({
      leadFeedbackInterest: value
    })
  }

  onEnterComment = (text) => {
    this.setState({
      leadFeedbackComment: text
    })
  }

  render () {
    return (
      <Container style={styles.container}>
        <View>
          {
            this.state.modalContent ? 
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            >
              <Container style={{ paddingTop: 100, paddingLeft: '10%', paddingRight: '10%' }}>
                  <Content padder>
                      <Text style={{ marginBottom: 10 }}>Provide feedback about your recent call with</Text>
                      <H1>{this.state.modalContent.name}</H1>
                      <Text style={{ marginBottom: 10 }}>{this.state.modalContent.phone}</Text>
                      <Item picker style={{ marginBottom: 10 }}>
                        <Picker
                          mode="dropdown"
                          style={{ width: '100%' }}
                          placeholder="Rate user's interest"
                          placeholderStyle={{ color: "#bfc6ea" }}
                          placeholderIconColor="#007aff"
                          selectedValue={this.state.leadFeedbackInterest}
                          onValueChange={this.leadFeedbackInterestChange.bind(this)}
                        >
                          <Picker.Item label="Select Lead's Interest Level" value="not_selected" />
                          <Picker.Item label="Very Interested" value="very_interested" />
                          <Picker.Item label="Interested" value="interested" />
                          <Picker.Item label="Not Interested" value="not_interested" />
                        </Picker>
                      </Item>
                      <Textarea 
                        rowSpan={5} 
                        bordered 
                        placeholder="Comments" 
                        style={{ marginBottom: 10, padding: 10 }}
                        onChangeText={(text) => {
                          this.onEnterComment(text)
                        }}
                        />
                      <Button 
                        block 
                        onPress={ () => {
                          this.hideModal()
                        }}
                        >
                          <Text>Done</Text>
                      </Button>
                  </Content>
              </Container>
            </Modal> : null
          }
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
