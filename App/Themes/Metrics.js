import {Dimensions, Platform} from 'react-native'

const { width, height } = Dimensions.get('window')

// Used via Metrics.baseMargin
const metrics = {
  borderWidth: 2,
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  borderRadius: 15,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: 4,
  nbaMainScoreHeight: 125,
  nbaMainScoreWidth: 125,
  nbaMainScreenWidth: width - 20,
  nbaLogoHeight: 80,
  timeWidth: 200,
  scoreWidth: 125,
  teamContainerHeight: 100,
  boxScoreHeight: 200,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    player: 100,
    team_logo: 70,
    logo: 200,
    nba_logo: 250,
    conference_logo: width*0.95,
    nba_logo_height: 400
  }
}

export default metrics
