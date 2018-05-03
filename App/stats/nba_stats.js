//file used to make api calls to stats.nba.com

function get_conference(team) {
  team = team.toLowerCase()
  var dict = {
    'atl': 'East',
    'bkn': 'East',
    'bos': 'East',
    'cha': 'East',
    'chi': 'East',
    'cle': 'East',
    'dal': 'West',
    'den': 'West',
    'det': 'East',
    'gsw': 'West',
    'hou': 'West',
    'ind': 'East',
    'lac': 'West',
    'lal': 'West',
    'mem': 'West',
    'mia': 'East',
    'mil': 'East',
    'min': 'West',
    'nop': 'West',
    'nyk': 'East',
    'okc': 'West',
    'orl': 'East',
    'phi': 'East',
    'phx': 'West',
    'por': 'West',
    'sac': 'West',
    'sas': 'West',
    'tor': 'East',
    'uta': 'West',
    'was': 'East',
  }
  return dict[team]
}

function get_team_logo_loc(team) {
  team = team.toLowerCase()
  var dict = {
    'atl': require('../../assets/img/atl.png'),
    'bkn': require('../../assets/img/bkn.png'),
    'bos': require('../../assets/img/bos.png'),
    'cha': require('../../assets/img/cha.png'),
    'chi': require('../../assets/img/chi.png'),
    'cle': require('../../assets/img/cle.png'),
    'dal': require('../../assets/img/dal.png'),
    'den': require('../../assets/img/den.png'),
    'det': require('../../assets/img/det.png'),
    'gsw': require('../../assets/img/gsw.png'),
    'hou': require('../../assets/img/hou.png'),
    'ind': require('../../assets/img/ind.png'),
    'lac': require('../../assets/img/lac.png'),
    'lal': require('../../assets/img/lal.png'),
    'mem': require('../../assets/img/mem.png'),
    'mia': require('../../assets/img/mia.png'),
    'mil': require('../../assets/img/mil.png'),
    'min': require('../../assets/img/min.png'),
    'nop': require('../../assets/img/nop.png'),
    'nyk': require('../../assets/img/nyk.png'),
    'okc': require('../../assets/img/okc.png'),
    'orl': require('../../assets/img/orl.png'),
    'phi': require('../../assets/img/phi.png'),
    'phx': require('../../assets/img/phx.png'),
    'por': require('../../assets/img/por.png'),
    'sac': require('../../assets/img/sac.png'),
    'sas': require('../../assets/img/sas.png'),
    'tor': require('../../assets/img/tor.png'),
    'uta': require('../../assets/img/uta.png'),
    'was': require('../../assets/img/was.png'),
  }
  return dict[team]
}

function get_dateString() {
  let today = new Date()
  //var d = today.getDate().toString()
  var d = (today.getDate() - 1).toString() //used for testing
  //var d = (today.getDate() - 5).toString() //used for testing
  if (d.length === 1) {
    d = '0' + d
  }
  var m = (today.getMonth() + 1).toString()
  if (m.length === 1) {
    m = '0' + m
  }
  var y = today.getFullYear()
  let dateString = y + m + d
  return dateString
}

function get_timeString() {
  let today = new Date()
  var h = today.getHours().toString()
  var m = today.getMinutes().toString()
  return h + m
}

function get_year() {
  let today = new Date()
  var y = today.getFullYear() - 1
  return y
}

function convert_time(time) {
  time = (time - 1200).toString()
  var first = time[0]
  var rest = time.substr(1)
  newTime = first + ':' + rest + ' pm'
  return newTime
}

function map_game(game) {
  var home_team = game['home']
  var away_team = game['visitor']
  var game_progress = null
  var game_time = parseInt(game['home_start_time'])
  var current_time = parseInt(get_timeString())
  var game_started = false
  var game_id = game.id
  var game_date = game.date

  let period_time = game['period_time']
  if (period_time['period_value'] === "0" || period_time['period_value'] === "") {
    game_progress = convert_time(game_time)
  } else {
    game_started = true
    if (period_time['period_status'] === 'Final') {
      game_progress = 'Final'
    } else {
      game_progress = period_time['period_status'] + ' ' + period_time['game_clock']
    }
  }

  let newGame = {
    home_city : home_team['city'],
    home_name : home_team['nickname'],
    home_id : home_team['id'],
    home_key : home_team['team_key'],
    home_score : home_team['score'],
    home_box : home_team['linescores'],

    away_city : away_team['city'],
    away_name : away_team['nickname'],
    away_id : away_team['id'],
    away_key : away_team['team_key'],
    away_score : away_team['score'],
    away_box : away_team['linescores'],

    game_progress: game_progress,
    game_started: game_started,
    game_date: game_date,
    game_id: game_id
  }
  return newGame
}

const APIRequest = {
  fetch_games: async () => {
    let dateString = get_dateString()
    let queryString = `http://data.nba.com/data/5s/json/cms/noseason/scoreboard/${ dateString }/games.json`
    let response = await fetch(queryString)
    let responseJSON = await response.json()
    var games = responseJSON['sports_content']['games']['game']
    games = games.map(map_game)
    return games
  },
  fetch_logo: (team) => {
    var teamKey = team.toLowerCase()
    return get_team_logo_loc(teamKey)
  },
  fetch_standings: async (conference) => {
    let year = get_year()
    let queryString = `http://data.nba.com/data/json/cms/${ year }/league/standings.json`
    let response = await fetch(queryString)
    let responseJSON = await response.json()
    let teams = responseJSON['sports_content']['standings']['team']
    teams = teams.filter(team => get_conference(team['abbreviation']) === conference)
    return teams
  },
  fetch_box_score: async (game_id,game_date) => {
    let queryString = `http://data.nba.com/data/10s/json/cms/noseason/game/${ game_date }/${ game_id }/boxscore.json`
    let response = await fetch(queryString)
    let responseJSON = await response.json()
    let data = responseJSON.sports_content.game
    let visitor = responseJSON.sports_content.game.visitor
    let home = responseJSON.sports_content.game.home
    let visitor_players = null
    let home_players = null
    if (visitor.players.hasOwnProperty('player')) {
      visitor_players = visitor.players.player
    }
    if (home.players.hasOwnProperty('player')) {
      home_players = home.players.player
    }
    var game = {
      game_progress: data.period_time.period_status,
      home_score: home.score,
      away_score: visitor.score,
      home_key: home.team_key,
      away_key: visitor.team_key,
      home_city: home.city,
      away_city: visitor.city,
      home_name: home.nickname,
      away_name: visitor.nickname
    }
    return [visitor_players,home_players,game]
  }
}

export default APIRequest
