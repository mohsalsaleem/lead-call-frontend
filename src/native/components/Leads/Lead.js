import React, { Component } from 'react';
import { StyleSheet, Linking } from 'react-native'
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
        console.log('Lead called for ')
        console.log(data)
        Linking.openURL(`tel:${data.phone}`)
    }

    render() {

        const { data, onSwipeLeft} = this.props

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
                        <CardItem>
                            <Left>
                                <Button rounded onPress={ () => { onSwipeLeft() } }>
                                    <Icon name="close"/>
                                </Button>
                            </Left>
                            <Right>
                                <Button onPress={ () => { this.openDialer( data ) }} rounded>
                                    <Icon name="md-call"/>
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                </ScrollView>
            </Content>
        )
    }
}

export default Lead

