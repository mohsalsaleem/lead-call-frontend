import React, { Component } from 'react';
import { StyleSheet, Platform, Button, Linking } from 'react-native';
import {
  Container, Content, Text, H1, H2, H3, View, DeckSwiper
} from 'native-base';

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
  Linking.openURL(`tel:${data.phone}`)
}

class Leads extends Component {

  constructor(props) {
    super(props)
  }

  swipeLeft = () => {
    this._deckSwiper._root.swipeLeft()
  }

  render () {
    return (
      <Container style={styles.container}>
        <View>
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

export default Leads;
