// Import third-party dependencies
import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView
} from 'react-native'

import Carousel from '../../components/Carousel/carousel'
import HeaderImage from '../../components/countdown/HeaderImage'
import CountdownView from '../../components/countdown/CountdownView'
import Announcements from '../../components/announcement/Announcements'
import Standings from '../../components/Standings/Standings'

// Component for home screen in main navigation
export class HomeScreen extends React.Component {
  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <HeaderImage />
          <CountdownView />
          <Announcements />
          <Standings />
          <Carousel />
        </SafeAreaView>
      </ScrollView>
    )
  }
}

HomeScreen.navigationOptions = {
  title: 'Home'
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
