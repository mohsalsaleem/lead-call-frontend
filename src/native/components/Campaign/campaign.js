import React, { Component } from 'react';
import { AppState, Alert, Modal,TouchableHighlight } from 'react-native';
import {
	Container, Text, CardItem, Card, Right, Icon, View, H2, Fab, Button, Content
} from 'native-base';
import Header from '../UI/Header';
import { DocumentPicker } from 'expo';
import Spacer from '../UI/Spacer';
import { Actions } from 'react-native-router-flux';

class CampaignUploadModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Modal
      animationType="slide"
      transparent={false}
      onRequestClose={() => {
        this.props.ClosedModal()
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'}}>
            <Container style={{ paddingTop: 100, paddingLeft: '10%', paddingRight: '10%' }}>
              <Content padder>
  		          <Spacer size={20}/>
                <H2>Upload a Campaign's Leads</H2>
                <Spacer size={20}/>
                <Button
                  onPress={() => {
                    DocumentPicker.getDocumentAsync({
                      type: '*/*'
                    }).then(response => {
                      console.log(response)
                      if (type === 'success') {
                        this.props.ClosedModal()
                      }
                    }).catch(err => {console.log(err)})
                  }}>
                  <Text>Select File</Text>
                </Button>
            </Content>
        </Container>
        </View>
      </Modal>)
  }
}

class Campaigns extends Component {
	
	state = {
    appState: AppState.currentState,
    uploadModal: false,
    campaigns: [{
      id: 'e2438a1d-ff6e-4ab6-a380-bd320c91c095',
      name: 'asdfghj'
    }, {
      id: 1234562,
      name: 'asdfghj'
    }, {
      id: 1234563,
      name: 'asdfghj'
    }, {
      id: 1234564,
      name: 'asdfghj'
    }, {
      id: 1234565,
      name: 'asdfghj'
    }, {
      id: 1234566,
      name: 'asdfghj'
	}]
	};
	
	constructor(props) {
		super(props)
		
	}
  
  renderCampaigns = () => {
    let cards = []

    this.state.campaigns.forEach((campaign) => {
      cards.push(
        <Card key={campaign.id}>
          <CardItem padder>
            <View padder>
              <Text onPress={ () => {
				Actions.leads( { campaign_id: campaign.id } )
			  }}>{campaign.name}</Text>
            </View>
            <Right>
              <Icon/>
            </Right>
          </CardItem>
        </Card>)
    })

    return cards
  }

  renderUploadFAB = () => {
    return (
      <Fab
        active={this.state.active}
        direction="up"
        containerStyle={{ }}
        style={{ backgroundColor: '#5067FF' }}
        position="bottomRight"
        onPress={() => this.setState({ uploadModal: !this.state.uploadModal })}>
          <Icon name="ios-cloud-upload" />
      </Fab>
    )
  }

	render() {
		return (
		<Container style={{margin: 10}}>
			<View padder style={{marginTop: 10, marginBottom: 10}}>
				<Header
				title="Campaigns"
				content="Here are your Campaigns"
				/>
			</View>
			<View style={{flex: 1, justifyContent: 'center'}}>
				{ this.renderCampaigns() }
			</View>
			<View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 36, zIndex: 1 }}>
				{ this.renderUploadFAB() }
			</View>

			{ this.state.uploadModal ? <CampaignUploadModal ClosedModal={() => {this.setState({uploadModal: false})}}/> : null }
		</Container>)
		}
	}
	
export default Campaigns