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

class Leads extends Component {

  state = {
    appState: AppState.currentState,
    
    callModalVisible: false,
    modalContent: undefined,
    leadFeedbackInterest: "not selected",
    leadFeedbackComment: "",
    
    escalateCallModalVisible: false,
    escalateModalContent: undefined,
    escalateLeadFeedbackInterest: "not selected",
    escalateLeadFeedbackComment: "",

    questionMap: {},
    leads: []
  };

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    
    const campaign_id = this.props.campaign_id
    const component = this

    AsyncStorage.getItem('user_data', (error, result) => {
			let data = JSON.parse(result)
      const userId = data["user_id"]
      const role = data['role'].toLowerCase()

      const url = "http://10.1.122.181:5000" + 
      (role === "supervisor" ? "/campaign/lead/escalated/details" : "/campaign/lead/details")

			fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					campaign_id: campaign_id,
					user_id: userId,
				})
			})
			.then((response) => {
				console.log(response);
				return response.json()
			})
			.then((res) => {

        console.log({res})

        const serverData = res

        const campaignData = serverData["campaign_data"]
        const campaignKeys = Object.keys(campaignData)
        let questionMap = {}
        campaignKeys.forEach((key) => {
          if(key.indexOf("question") !== -1 && campaignData[key] !== "Email") {
            const questionKey = key.split("_")
            const question = campaignData[key]
            questionMap[questionKey[1]] = question
          }
        })

        const leadData = serverData["lead_values"]
        const leads = []

        leadData.forEach((leadDatum) => {
          let leadItem = {
            name: leadDatum.name,
            phone: leadDatum.mobile_number,
            id: leadDatum.id,
            called: false
          }

          const leadResponseKeys = Object.keys(leadDatum).filter((key) => {
            return key.indexOf("response") !== -1
          })

          const qanda = leadResponseKeys.map((key) => {
            const index = key.split("_")[1]
            const qandaObj = {
              question: questionMap[index],
              answer: leadDatum[key]
            }
            return qandaObj
          })

          leadItem['qanda'] = qanda
          leadItem['interestScore'] = Math.floor(Math.random()*(90 - 70 + 1) + 70)

          leads.push(leadItem)
        })

        component.setState(
          { 
            leads: leads 
          }
        )

			})
			.catch((error) => {
				console.log(error)
			})
		})


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
    }
    this.setState({appState: nextAppState});
  };

  swipeLeft = () => {
    this._deckSwiper._root.swipeLeft()
  }

  swipeRight = () => {
    this._deckSwiper._root.swipeRight()
  }

  showLastDialledLeadForm = (data) => {
    this.setState({
      callModalVisible: data !== null,
      modalContent: data
    })
  }

  showEscalateLeadForm = (data) => {
    this.setState({
      escalateCallModalVisible: data !== null,
      escalateModalContent: data
    })
  }

  clearLastDialledLead = async() => {
    await AsyncStorage.removeItem('lastDialledLead')
  }

  onSwipeRight = (data) => {
    this.showLastDialledLeadForm(data);
  }

  onSwipeLeft = (data) => {
    this.showEscalateLeadForm(data);
  }

  hideModal = (fromCall) => {

    const feedBack = {
      user: fromCall ? this.state.modalContent : this.state.escalateModalContent,
      interestLevel: fromCall ? this.state.leadFeedbackInterest : this.state.escalateLeadFeedbackInterest,
      comment: fromCall ? this.state.leadFeedbackComment : this.state.escalateLeadFeedbackComment
    }

    const url = "http://10.1.122.181:5000" +
    (fromCall ? "/campaign/lead/called" : "/campaign/lead/escalate")

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lead_id: feedBack.user.id,
        remarks: feedBack.comment,
        status: feedBack.interestLevel
      })
    })
    .then((res) => res.json)
    .then((res) => {
      console.log(res)
    })
    .catch((error) => {
      console.log(error)
    })

    if(fromCall) {
      this.setState({
        callModalVisible: false
      })
    } else {
      this.setState({
        escalateCallModalVisible: false
      })
    }
  }

  leadFeedbackInterestChange = (value) => {
    this.setState({
      leadFeedbackInterest: value
    })
  }

  escalateLeadFeedbackInterestChange = (value) => {
    this.setState({
      escalateLeadFeedbackInterest: value
    })
  }

  onEnterComment = (text) => {
    this.setState({
      leadFeedbackComment: text
    })
  }

  onEnterEscalateComment = (text) => {
    this.setState({
      escalateLeadFeedbackComment: text
    })
  }

  render () {

    console.log(this.state.leads)

    return (
      <Container style={styles.container}>
        <View>
        {
          this.state.modalContent ? 
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.callModalVisible}
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
                          <Picker.Item label="Select Lead's Interest Level" value="not selected" />
                          <Picker.Item label="Very Interested" value="very interested" />
                          <Picker.Item label="Interested" value="interested" />
                          <Picker.Item label="Not Interested" value="not interested" />
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
                          this.hideModal(true)
                        }}
                        >
                          <Text>Done</Text>
                      </Button>
                  </Content>
              </Container>
            </Modal> : 
            null
        }
            {
              this.state.escalateModalContent ? 
              <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.escalateCallModalVisible}
            >
              <Container style={{ paddingTop: 100, paddingLeft: '10%', paddingRight: '10%' }}>
                  <Content padder>
                      <Text style={{ marginBottom: 10 }}>Provide feedback about your recent call with</Text>
                      <H1>{this.state.escalateModalContent.name}</H1>
                      <Text style={{ marginBottom: 10 }}>{this.state.escalateModalContent.phone}</Text>
                      <Textarea 
                        rowSpan={5} 
                        bordered 
                        placeholder="Comments" 
                        style={{ marginBottom: 10, padding: 10 }}
                        onChangeText={(text) => {
                          this.onEnterEscalateComment(text)
                        }}
                        />
                      <Button 
                        block 
                        onPress={ () => {
                          this.hideModal(false)
                        }}
                        >
                          <Text>Done</Text>
                      </Button>
                  </Content>
              </Container>
            </Modal> : null
            }
          {
            this.state.leads.length ? 
            <DeckSwiper
            ref={ (c) => this._deckSwiper = c }
            dataSource={this.state.leads}
            renderItem={ 
              item => <Lead
                        data={item}
                        onSwipeLeft={(id) => {
                          this.swipeLeft()
                        }}
                        onSwipeRight={(id) => {
                          this.swipeRight()
                        }}
                        />
            }
            onSwipeLeft={(data) => {
                    this.onSwipeLeft(data)
                  }}
            onSwipeRight={ (data) => {
                    this.onSwipeRight(data)
                  }}/> : null
          }
        </View>
      </Container>
    )
  }
}

export default connect()(Leads);
