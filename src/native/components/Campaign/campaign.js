import React, { Component } from 'react';
import { AppState, Alert, Modal,TouchableHighlight, AsyncStorage } from 'react-native';
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
    campaigns: []
	};
	
	constructor(props) {
		super(props)
		
	}

	// getLocalItem = async (key) => {
	// 	const value = await AsyncStorage.getItem(key, (error, result) => {
	// 		console.log('erer', error, result)
	// 	})
	// 	return value
	// }

	componentDidMount() {
		const component = this
		AsyncStorage.getItem('user_data', (error, result) => {
			let data = JSON.parse(result)
			const businessId = data["business_id"]
			const userId = data["user_id"]
			fetch('http://10.1.122.181:5000/campaign/details', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					business_id: businessId,
					user_id: userId,
				})
			})
			.then((response) => {
				console.log(response);
				return response.json()
			})
			.then((res) => {
				component.setState({
					campaigns: res["campaign_list"]
				})
			})
			.catch((error) => {
				console.log(error)
			})
		})
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
				title="Campaign List"
				content="All your campaigns in one zone"
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