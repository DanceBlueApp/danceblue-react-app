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
      user: undefined,
      name: undefined,
      email: undefined,
      teamNo: undefined,
      teamName: undefined,
      uid: undefined
    }

    this.handleSignOut = this.handleSignOut.bind(this)
  }

  componentDidMount () {
    this.props.firebase.checkAuthUser(user => {
      if (user) {
        let email = undefined;
        let name = undefined;
        let teamNo = undefined;
        let teamName = undefined;
        let uid = undefined;
        this.props.firebase.getUserData('8gi9WB5XMMdFwmwaAZQrGdq1GGC3').then(data => {
          console.log(data.data().email);
          email = data.data().email;
          name = data.data().name;
          teamNo = data.data().team;
          uid = data.data().uid;
          });
        this.setState({ loggedIn: true, user: user, email: email, teamNo: teamNo})
      }
    })
  }

  handleSignOut () {
    this.props.firebase.signOut().then(() => {
      this.setState({ loggedIn: false, user: undefined })
    })
  }

  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation
    //Show either profile (if logged in) or log-in/sign-up page (if logged out)
    return (
      <> 
        {this.state.loggedIn && (
          <View>
            <Text>{this.state.user.name}</Text>
            <Text>{"Email Address: "}{this.state.user.email}</Text>
            <Text>{"UID: "} {this.state.user.uid}</Text>
            <Button title='Sign out' onPress={this.handleSignOut} type='clear' />
          </View>
        )}
        {!this.state.loggedIn && (
          <View>
            <Text h2 style={{ textAlign: 'center' }}>
              Sign Up
            </Text>
            <SignUpForm />
            <Text h2 style={{ textAlign: 'center' }}>
              Login
            </Text>
            <LoginForm />
          </View>
        )}
      </>
    )
  }
}

export default withFirebaseHOC(ProfileScreen)
