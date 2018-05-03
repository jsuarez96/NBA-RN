import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, AsyncStorage, ActivityIndicator } from 'react-native';
import APIRequest from './App/stats/nba_stats.js'
import { Colors, Metrics } from './App/Themes'
const { getMainColor } = require('nba-color');
import { material } from 'react-native-typography'
import TeamScores from './App/Screens/teamScores.js'
import TabNav from './App/Navigation/TabNavigation.js'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './App/reducers/index.js'
import thunk from 'redux-thunk'
import Onboarding from './App/Screens/onBoarding.js'
console.disableYellowBox = true;

const store = createStore(rootReducer, applyMiddleware(thunk))

export default class App extends React.Component {

  constructor(props){
    super(props)
    //this.resetData()
  } 

  state = {
    hasDoneOnboarding: false,
    loading: true
  }

  _onDone = () => {
    this.setState({
      hasDoneOnboarding: true
    });

  }

  async componentWillMount() {
    try {
      const first = await AsyncStorage.getItem('first')
      if(first === null){
        await AsyncStorage.setItem('first','true')
        this.setState({
          loading: false,
        })
      } else {
        this.setState({
          hasDoneOnboarding: true,
          loading: false
        })
      }
    } catch(error) {
      console.log(error)
    }
  }

  //use this to clear AsyncStorage
  resetData = async () => {
    await AsyncStorage.clear()
  }

  render() {
    if(this.state.loading){
      return (<ActivityIndicator style={styles.activityIndicator} size="large" color="black"/>)
    } else {
      if(this.state.hasDoneOnboarding) {
        return (
          <Provider store={store}>
            <TabNav />
          </Provider>
        );
      } else {
        return (
          <Onboarding onDone={this._onDone} />
        )
      }
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
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  splash_container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
