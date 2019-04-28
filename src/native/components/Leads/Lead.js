import React, { Component } from 'react';
import { StyleSheet, Linking, AsyncStorage } from 'react-native'
import { Container, Content, H1, H3, Button, Text, Card, CardItem, Left, Right } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Icon } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    answerText: {
        marginTop: 15
    }
})

const QandA = ({ items }) => {
    return items.map( item => {
        return (
            <CardItem>
                <Content>
                    <Text>
                        { item.question }    
                    </Text>
                    <H3 style={ styles.answerText }>
                        { item.answer }
                    </H3>
                </Content>
            </CardItem>
        )
    })
}


class Lead extends Component {

    componentDidMount() {
        console.log('asdasd');  
    }

    openDialer = (data) => {
        const dataString = JSON.stringify(data);
        AsyncStorage.setItem('lastDialledLead', dataString)
        Linking.openURL(`tel:${data.phone}`)
    }

    render() {

        const { data, onSwipeLeft, onSwipeRight} = this.props

        return (
            <Content scrollEnabled={true}>
                <ScrollView>
                    <Card style={{ elevation: 3 }}>
                        <CardItem>
                            <Left>
                                <H1>{ data.name }</H1>
                            </Left>
                            <Right>
                                <Button onPress={ () => { this.openDialer( data ) }} rounded>
                                    <Icon name="md-call"/>
                                </Button>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Text>Interest Score: { data.interestScore }</Text>
                        </CardItem>
                        <QandA items={ data.qanda } />
                    </Card>
                </ScrollView>
            </Content>
        )
    }
}

export default Lead

