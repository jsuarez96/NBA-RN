import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { TabNavigator } from 'react-navigation'

import TeamScores from '../Screens/teamScores.js'
import BoxScores from '../Screens/BoxScores.js'
import Standings from '../Screens/standings.js'
import { StackNavigator } from 'react-navigation'

const StandingsTabNav = TabNavigator({
  West: {
    screen: Standings,
  },
  East: {
    screen: Standings
  },
}, {
  tabBarPosition: 'top',
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
  },
})

const StackNav = StackNavigator({
  Team: {
    screen: TeamScores,
  },
  BoxScore: {
    screen: BoxScores
  }
}, {
  headerMode: 'float',
  initialRouteName: 'Team',
})

const TabNav = TabNavigator({
  Scores: { screen: StackNav },
  Standings: { screen: StandingsTabNav },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
  },
})

export default TabNav
