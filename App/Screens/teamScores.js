import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import APIRequest from '../stats/nba_stats.js'
import { Colors, Metrics } from '../Themes'
const { getMainColor } = require('nba-color');
import { material } from 'react-native-typography'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/index.js';
import { getGameData } from '../actions/index.js'
import { reloadGames } from '../actions/index.js'

@connect(mapStateToProps, mapDispatchToProps)
export default class TeamScores extends React.Component {

  state = {
    refreshing: false
  }

  static navigationOptions = {
    headerTitleStyle: { alignSelf: 'center'},
    title: <View style={{width: Metrics.images.logo, height: Metrics.navBarHeight}}><Image source={require('../../assets/nba_logo.png')} style={{flex: 1,width: null,height: null,resizeMode: 'contain'}}/></View>,
    headerBackTitle: 'Scores'
  }

  componentWillReceiveProps(nextProps) {
    this.props.games = nextProps.games
  }

  componentWillMount(){
    if (this.props.games.length === 0) {
      this.props.reloadGames()
    }
  }

  box_score_not_available = (item) => {
    Alert.alert(
      'Box Score Not Available',
      'This Game Begins at ' + item.game_progress,
      [{text: 'Okay', onPress: () => console.log("OK")}],
      {
        cancelable: true
      }
    )
  }

  _onPressItem = (item) => {
    if (item.game_started) {
      this.props.navigation.navigate('BoxScore',item)
      this.props.getGameData(item.game_id,item.game_date)
    } else {
      this.box_score_not_available(item)
    }
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.props.reloadGames()
      this.setState({
        refreshing: false
      })
    })
  }

  get_score_object = (item) => {
    let started = item['game_started']
    if (started) {
      return (
        <TouchableOpacity onPress={() => this._onPressItem(item)}>
          <View style={styles.scoreObject}>
            <View style={styles.gameTime}>
              <Text style={material.titleWhite}>{item.game_progress}</Text>
            </View>
            <View style={styles.teamScores}>
              <View style={styles.teamScore}>
                <Text style={material.display1White}>{item.away_score}</Text>
              </View>
              <View style={styles.teamScore}>
                <Text style={material.display1White}>{item.home_score}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => this._onPressItem(item)}>
          <View style={styles.scoreObject}>
            <Text style={material.titleWhite}>{item.game_progress}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  _extractKey = (item, index) => index

  _renderItem = ({item}) => {
    let homeLogo = APIRequest.fetch_logo(item.home_key)
    let awayLogo = APIRequest.fetch_logo(item.away_key)
    let scoreObject = this.get_score_object(item)
    return (
      <View style={[styles.single_game, {backgroundColor: getMainColor(item.home_key)['hex']}]}>
        <View style={styles.team}>
          <View style={styles.teamLogoContainer}>
            <Image style={styles.teamLogo} source={awayLogo}/>
          </View>
          <View style={styles.teamName}>
            <Text style={material.subheadingWhite}>{item.away_city}</Text>
            <Text style={material.titleWhite}>{item.away_name}</Text>
          </View>
        </View>

        {scoreObject}

        <View style={styles.team}>
          <View style={styles.teamLogoContainer}>
            <Image style={styles.teamLogo} source={homeLogo}/>
          </View>
          <View style={styles.teamName}>
            <Text style={material.subheadingWhite}>{item.home_city}</Text>
            <Text style={material.titleWhite}>{item.home_name}</Text>
          </View>
        </View>

      </View>
    )
  }

  render() {
    if (this.props.games.length === 0) {
      return (
        <View style={{flex: 1}}>
          <ActivityIndicator
          style={styles.activityIndicator}
          size="large" color="black"/>
        </View>
      )
    } else {
      return (
            <SafeAreaView style={styles.container}>
              <FlatList
                style={styles.game_container}
                data={this.props.games}
                renderItem={this._renderItem}
                keyExtractor={this._extractKey}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}/>
            </SafeAreaView>)
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nba_logo: {
    width: Metrics.nbaMainScreenWidth,
    height: Metrics.nbaLogoHeight,
  },
  nba_logo_image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  game_container: {
  },
  single_game: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Metrics.nbaMainScreenWidth,
    height: Metrics.nbaMainScoreHeight,
    margin: Metrics.baseMargin,
    borderRadius: Metrics.borderRadius,
    padding: Metrics.smallMargin
  },
  team: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamLogoContainer: {
    width: Metrics.images.team_logo,
    height: Metrics.images.team_logo
  },
  teamLogo: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  teamName: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamScore: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreObject: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: Metrics.scoreWidth
  },
  teamScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Metrics.scoreWidth
  },
  gameTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.timeWidth,
  },
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function mapDispatchToProps(dispatch, props) {
  return {
    getGameData: (game_id, game_date) => dispatch(getGameData(game_id, game_date)),
    reloadGames: () => dispatch(reloadGames())
  };
}

function mapStateToProps(state, props) {
  let games = state.allGamesReducer.games
  return {
    games: state.allGamesReducer.games
  }
}
