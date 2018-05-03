import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import APIRequest from '../stats/nba_stats.js'
const { getMainColor } = require('nba-color');
import { Colors, Metrics } from '../Themes'
import { material } from 'react-native-typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/index.js';
import { reloadStandings } from '../actions/index.js'

@connect(mapStateToProps, mapDispatchToProps)
export default class Standings extends React.Component {

  componentWillMount(){
    if (this.props.teams.length === 0) {
      this.props.reloadStandings()
    }
    this.setState({
      conference: this.props.navigation.state.key
    })
  }

  componentWillReceiveProps(newProps) {
    this.props.teams = newProps.teams
  }

  state = {
    conference: '',
  }

  _extractKey = (item, index) => index

  _renderItem = ({item}) => {
    let logo = APIRequest.fetch_logo(item.abbreviation)
    return (
        <View style={[styles.teamContainer, {backgroundColor: getMainColor(item.abbreviation)['hex']}]}>
          <View style={styles.teamLogoContainer}>
            <Image style={styles.teamLogo} source={logo}/>
          </View>

          <View style={styles.recordContainer}>
            <Text style={material.titleWhite}>{item.team_stats.wins}-{item.team_stats.losses}</Text>
          </View>
          <View style={styles.recordContainer}>
            <Text style={material.titleWhite}> {item.team_stats.gb_conf} GB</Text>
          </View>
        </View>)
  }

  render() {
    return (
      <FlatList
        style={styles.game_container}
        data={this.props.teams}
        renderItem={this._renderItem}
        keyExtractor={this._extractKey}/>
    );
  }
}

const styles = StyleSheet.create({
  game_container: {
  },
  teamContainer: {
    height: Metrics.teamContainerHeight,
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  teamLogoContainer: {
    width: Metrics.teamContainerHeight,
    height: Metrics.teamContainerHeight
  },
  recordContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamLogo: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});

function mapDispatchToProps(dispatch, props) {
  return {
    reloadStandings: () => dispatch(reloadStandings())
  };
}

function mapStateToProps(state, props) {
  if (props.navigation.state.key === 'West'){
    return {
      teams: state.standingsReducer.westTeams
    }
  } else {
    return {
      teams: state.standingsReducer.eastTeams
    }
  }
}
