import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Colors, Metrics } from '../Themes'
import PropTypes from 'prop-types';

export default class OnboardingScreen extends React.Component {

  static propTypes = {
      onDone: PropTypes.func.isRequired
  };

  _onDone = () => {
    if (this.props.onDone) {
      this.props.onDone()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Onboarding
          showSkip={false}
          onDone= {this._onDone}
          pages={[
            {
              backgroundColor: '#fff',
              image: <Image style={styles.conferenceImage} source={require('../../assets/nba_west.png')} />,
              title: 'Game Scores',
              subtitle: 'Get the most up-to-date scores for today\'s NBA games.',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.conferenceImage} source={require('../../assets/nba_east.png')} />,
              title: 'Standings',
              subtitle: 'View standings from both conferences in the Association.',
            },
            {
              backgroundColor: '#fff',
              image: <Image style={styles.logoImage} source={require('../../assets/nba_logo.png')} />,
              title: 'Box Scores',
              subtitle: 'Get individual player stats from today\'s games.',
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoImage: {
    height: Metrics.images.nba_logo,
    width: Metrics.images.conference_logo,
  },
  conferenceImage: {
    height: Metrics.images.nba_logo_height,
    width: Metrics.screenWidth,
  }
});
