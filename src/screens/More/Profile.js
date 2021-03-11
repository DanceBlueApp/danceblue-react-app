// Import third-party dependencies
import React from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-elements'

import SignUpForm from '../../components/SignUpForm'
import LoginForm from '../../components/LoginForm'

import { withFirebaseHOC } from '../../../config/Firebase'

// Component for profile screen in main navigation
class ProfileScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      user: undefined
    }

    this.handleSignOut = this.handleSignOut.bind(this)
  }

  componentDidMount () {
    this.props.firebase.checkAuthUser(user => {
      if (user) {
        this.setState({ loggedIn: true, user: user })
      }
    })
  }

  handleSignOut () {
    this.props.firebase.signOut().then(() => {
      this.setState({ loggedIn: false, user: undefined })
    })
  }
//This will handle the guest sign in and allow the user to access it while giving them the anonymous tag
  guestSignin(){
    this.props.firebase.anonymousUser().then(() => {
    this.setState({ loggedIn: true})})
    }
  

  render () {
    /* eslint-disable */
    //added the buttons for the signin guests
    const { navigate } = this.props.navigation
    return (
      <>
        {this.state.loggedIn && (
          <View>
            <Text>{this.state.user.email}</Text>
            <Button title='Signout' onPress={this.handleSignOut} type='clear' />
          </View>
        )}
        {!this.state.loggedIn && (
          <View>
            <Text h2 style={{ textAlign: 'center' }}>
              Sign Up
            </Text>
            <SignUpForm />
            <Button title="Sign in as Guest?" onPress={this.guestSignin} type="clear" />
            <Text h2 style={{ textAlign: 'center' }}>
              Login
            </Text>
            <LoginForm />
            <Button title="Sign in as Guest?" onPress={this.guestSignin} type="clear" />
          </View>
        )}
      </>
    )
  }
}

export default withFirebaseHOC(ProfileScreen)
