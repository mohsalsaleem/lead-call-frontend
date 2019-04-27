import React, { Component } from 'react';
import { StyleSheet, View, Platform, Button } from 'react-native';
import {
  Container, Content, Text, H1, H2, H3,
} from 'native-base';
import Swiper from 'react-native-deck-swiper';

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
  leads.push('Hello ' + i)
}

const Leads = () => (
  <View style={styles.container}>
        <Swiper
            useViewOverflow={Platform.OS === 'ios'}
            cards={leads}
            renderCard={(card) => {
                return (
                    <View style={styles.card}>
                        <Text style={styles.text}>{card}</Text>
                    </View>
                )
            }}
            onSwiped={(cardIndex) => {console.log(cardIndex)}}
            onSwipedAll={() => {console.log('onSwipedAll')}}
            cardIndex={0}
            backgroundColor={'#4FD0E9'}
            stackSize= {3}>
        </Swiper>
    </View>
);

export default Leads;
