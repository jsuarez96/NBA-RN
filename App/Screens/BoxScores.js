import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import APIRequest from '../stats/nba_stats.js'
import { Colors, Metrics } from '../Themes'
const { getMainColor } = require('nba-color')
const { getColors } = require('nba-color')
import { material } from 'react-native-typography'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from '../actions/index.js';
import { GET_GAME_DATA } from '../actions/index.js'

@connect(mapStateToProps,null)
export default class BoxScores extends React.Component {

  componentWillReceiveProps(nextProps) {
    this.props.game = nextProps.game
    this.props.away_players = nextProps.away_players
    this.props.home_players = nextProps.home_players
  }

  state = {
    //Can be H: Home, or A: Away
    viewing: 'H'
  }

  _onPressItem = (team) => {
    this.setState({
      viewing: team,
    })
  }

  _extractKey = (item, index) => index

  _renderItem = ({item}) => {
    if (item === null) {
      return (
        <View>
        </View>
      )
    }
    let game = this.props.game
    let display_key = game.home_key
    let colors = Object.values(getColors(game.home_key))
    let secondaryColor = 'white'
    if (this.state.viewing !== 'H') {
      display_key = game.away_key
      colors = Object.values(getColors(game.away_key))
    }
    if (colors.length > 1) {
      secondaryColor = colors[1]['hex']
    }
    if (item === 'X') {
      return this.get_header()
    } else {
      return (
        <View style={[styles.player ,{backgroundColor: getMainColor(display_key)['hex'], borderColor: secondaryColor}]}>
          <Image
            style={{width: 98, height: 98, position: 'absolute',left: 0, top: 0,}}
            source={{uri: `http://stats.nba.com/media/players/230x185/${ item.person_id }.png`}}
          />
          <View style={styles.player_info}>
            <Text style={material.titleWhite}> {item.first_name} {item.last_name} </Text>
            <View style={styles.player_stats}>
              <Text style={material.buttonWhite}> {item.points} pts {parseInt(item.rebounds_offensive) + parseInt(item.rebounds_defensive)} reb {item.assists} ast </Text>
            </View>
          </View>
        </View>
      )
    }

  }

  get_header = () => {
    let game = this.props.game
    let homeLogo = APIRequest.fetch_logo(game.home_key)
    let awayLogo = APIRequest.fetch_logo(game.away_key)
    let display_key = game.home_key
    if (this.state.viewing !== 'H') {
      display_key = game.away_key
    }
    return (
      <View style={[styles.box_score, {backgroundColor: getMainColor(display_key)['hex']}]}>
        <View style={styles.team}>
          <TouchableOpacity onPress={() => this._onPressItem('A')}>
            <View style={styles.teamLogoContainer}>
              <Image style={styles.teamLogo} source={awayLogo}/>
            </View>
          </TouchableOpacity>
          <View style={styles.teamName}>
            <Text style={material.subheadingWhite}>{game.away_city}</Text>
            <Text style={material.titleWhite}>{game.away_name}</Text>
          </View>
        </View>

        <View style={styles.scoreObject}>
          <View style={styles.gameTime}>
            <Text style={material.titleWhite}>{game.game_progress}</Text>
          </View>
          <View style={styles.teamScores}>
            <View style={styles.teamScore}>
              <Text style={material.display1White}>{game.away_score}</Text>
            </View>

            <View style={styles.teamScore}>
              <Text style={material.display1White}>{game.home_score}</Text>
            </View>
          </View>
        </View>

        <View style={styles.team}>
          <TouchableOpacity onPress={() => this._onPressItem('H')}>
            <View style={styles.teamLogoContainer}>
              <Image style={styles.teamLogo} source={homeLogo}/>
            </View>
          </TouchableOpacity>
          <View style={styles.teamName}>
            <Text style={material.subheadingWhite}>{game.home_city}</Text>
            <Text style={material.titleWhite}>{game.home_name}</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    let game = this.props.game
    if (game !== null){
      let colors = Object.values(getColors(game.home_key))
      let secondaryColor = 'white'
      let team = this.props.home_players
      if (this.state.viewing !== 'H') {
        team = this.props.away_players
        colors = Object.values(getColors(game.away_key))
      }
      if (colors.length > 1) {
        secondaryColor = colors[1]['hex']
      }
      return (
        <FlatList
          style={[styles.game_container, {}]}
          data={team}
          renderItem={this._renderItem}
          keyExtractor={this._extractKey}
          extraData={this.state.viewing}/>
      )
    } else {
      return (
        <View>
        </View>
      );
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
  game_container: {

  },
  box_score: {
    width: Metrics.screenWidth,
    height: Metrics.boxScoreHeight,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  player: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Metrics.images.player,
    borderWidth: Metrics.borderWidth
  },
  player_info: {
  },
  player_stats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  team: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  teamLogoContainer: {
    width: Metrics.nbaLogoHeight,
    height: Metrics.nbaLogoHeight
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
    width: Metrics.nbaMainScoreHeight
  },
  teamScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Metrics.nbaMainScoreWidth
  },
  gameTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.timeWidth,
  }
});

function mapStateToProps(state, props) {
  return {
    away_players: state.gameSelectedReducer.away_players,
    home_players: state.gameSelectedReducer.home_players,
    game: state.gameSelectedReducer.game
  }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}
