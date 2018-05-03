import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, TouchableOpacity, Modal } from 'react-native';
import APIRequest from '../stats/nba_stats.js'
import { Colors, Metrics } from '../Themes'
const { getMainColor } = require('nba-color');
import { material } from 'react-native-typography'

export default class TeamModal extends React.Component {

  constructor(props){
    super()
  }

  // state = {
  //   display: false
  // }

  // <Modal
  //   transparent={false}
  //   animationType={'slide'}
  //   visible{this.props.visible}
  //   >
  // <Text> HOWDY DOO </Text>
  //
  // </Modal>

  render() {
    //console.log("INNA RENDR", this.props)
    let shouldDisplay = false
    if (this.props.props.item.id === this.props.props.display) {
      shouldDisplay = true
    }
    return (
      <View>
        <Modal
          transparent={false}
          animationType={'slide'}
          visible={shouldDisplay}>
          <Text>TEAM</Text>
        </Modal>
      </View>
    )
  }
}
