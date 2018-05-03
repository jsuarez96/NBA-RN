import { combineReducers } from 'redux';
import APIRequest from '../stats/nba_stats.js'
import { GET_GAME_DATA } from '../actions/index.js'
import { RELOAD_GAMES } from '../actions/index.js'
import { RELOAD_STANDINGS } from '../actions/index.js'

//represents the initial state -- for a specific game
const gamesState = {
  away_players: [],
  home_players: [],
  game: null
}

//represents the initial state -- for list of games
const allGamesState = {
  games: []
}

//represents the initial state -- for standings
const standingsState = {
  eastTeams: [],
  westTeams: []
}

const gameSelectedReducer = (state = gamesState, action) => {
    switch (action.type) {
      case 'GET_GAME_DATA':
        let newState = action.data
        return {
          away_players: newState[0],
          home_players: newState[1],
          game: newState[2]
        }
      default:
        return state
    }
}

const allGamesReducer = (state = allGamesState, action) => {
  switch (action.type) {
    case 'RELOAD_GAMES':
      return {
        games: action.data
      }
    default:
      return state
  }
}

const standingsReducer = (state = standingsState, action) => {
  switch (action.type) {
    case 'RELOAD_STANDINGS':
      return {
        westTeams: action.data[0],
        eastTeams: action.data[1]
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  gameSelectedReducer,
  allGamesReducer,
  standingsReducer
})

export default rootReducer
