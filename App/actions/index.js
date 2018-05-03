import APIRequest from '../stats/nba_stats.js'
export const GET_GAME_DATA = 'GET_GAME_DATA'
export const RELOAD_GAMES = 'RELOAD_GAMES'
export const RELOAD_STANDINGS = 'RELOAD_STANDINGS'

get_box_score = async (game_id, game_date) => {
  let game_data = await APIRequest.fetch_box_score(game_id,game_date)
  let away_players = ['X'].concat(game_data[0])
  let home_players = ['X'].concat(game_data[1])
  let game = game_data[2]
  return [away_players,home_players,game]
}

export function getGameData(game_id, game_date) {
  return async (dispatch) => {
    let newState = await get_box_score(game_id, game_date)
    dispatch({
      type: GET_GAME_DATA,
      data: newState
    })
  }
}

export function reloadGames() {
  return async (dispatch) => {
    let newGames = await APIRequest.fetch_games()
    dispatch({
      type: RELOAD_GAMES,
      data: newGames
    })
  }
}

export function reloadStandings() {
  return async (dispatch) => {
    let westTeams = await APIRequest.fetch_standings('West')
    let eastTeams = await APIRequest.fetch_standings('East')
    dispatch({
      type: RELOAD_STANDINGS,
      data: [westTeams,eastTeams]
    })
  }
}
