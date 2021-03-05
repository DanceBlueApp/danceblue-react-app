// Import third-party dependencies
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button } from 'react-native-elements'

import SignUpForm from '../../components/SignUpForm'
import LoginForm from '../../components/LoginForm'

import { withFirebaseHOC } from '../../../config/Firebase'

//For edit icons
import Icon from 'react-native-vector-icons/FontAwesome5'

// Component for profile screen in main navigation
class ProfileScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      signUp: false,
      user: undefined, 
      name: undefined,
      email: undefined,
      teamNo: undefined,
      teamName: undefined,
      teamInfo: [],
      uid: undefined
    }
  

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount () {
    this.props.firebase.checkAuthUser(user => {
        let email = undefined;
        let name = undefined;
        let teamNo = undefined;
        let teamName = undefined;
        let uid = undefined;
        //console.log('user: ', user);
      if (user) {
        //define team info vars to load with database data
        this.props.firebase.getUserData(user.uid).then(data => {
          email = data.data().email;
          name = data.data().name;
          teamNo = data.data().team;
          uid = data.data().uid;
          this.getTeamName(data.data().team);
          this.setState({ 
            loggedIn: true, 
            user: user, 
            name: name,
            email: email, 
            teamNo: teamNo, 
            uid: uid});
        });
        
        //console.log('teamNo save test', this.state.teamNo);
        //console.log('let teamNo test: ', teamNo);
        // this.props.firebase.getTeam(teamNo).then(data => {
        //   console.log('teamNo Test: ', data.data());
        // })
      }
    })
  }

  // SUPER jank way of doing this. Need to figure out how to actually do queries 
  // instead of pulling the entire team database and searching it in JS.
  // Currently: gets the entire teams collection, searches the 'number' field
  // of the array of objects, returns the index of that team, 
  // pulls the name field of that index, and updates the team name state.
  // For future: query the DB for the name and throw it in the state.
  // Couldn't get any of the code from tutorials to actually do this.
  getTeamName(teamNo) {
    let teamName = undefined
    if(teamNo != undefined){
      const teams = [];
      let teamInfo = [];
      this.props.firebase.getTeams().then(snapshot => {
        snapshot.forEach(doc => {
          teams.push({ id: doc.id, ...doc.data() })
        })
        let team = teams.findIndex(function(post, index) {
          if(post.number == teamNo)
            return true;
        })
        teamName = teams[team].name;
        //console.log('teams[team]:', teams[team]);
        teamInfo = teams[team];
        //console.log('teamInfo: ', teamInfo);
        this.setState({teamInfo: teamInfo});
        this.setState({teamName: teamName});
      });
    }
    
    //Various attempts at getting DB queries working.
    console.log('getTeamName teamNo = ', teamNo);
    console.log('teamNo === undefined?', (teamNo === undefined))
    let num = Number(teamNo);
    console.log('num =', num);
    if(num != NaN){
      this.props.firebase.getTeam(teamNo)
        .then((querySnapshot) => {
        //console.log('querySnapshot: ', querySnapshot)
      querySnapshot.forEach((doc) => { //Everything seems to work until this point. I get no output.
        console.log("doc: ", doc);
        console.log(doc.id, ' => ', doc.data());
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
    }
      
  }
  
  

  handleSignOut () {
    this.props.firebase.signOut().then(() => {
      this.setState({ loggedIn: false, signUp: false, user: undefined })
    })
  }

  handleSignIn() {
    if (this.state.signUp == true) {
      this.setState({ loggedIn: false, signUp: false, user: undefined });
    } else {
      this.setState({ loggedIn: false, signUp: true, user: undefined });
    }
  }
  

  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation
    // Show either profile (if logged in) or log-in/sign-up page (if logged out)
    // console.log('nameTest', this.state.name);
    //console.log('this.teamInfo:', this.state.teamInfo);
    return (
      <> 
        {this.state.loggedIn && (
          <View style={styles.vertiStyle}>
            <View style={styles.horiStyle}>
              <Button type="clear" icon={{name: "edit"}}/>
              <Text h3>{"Name: "}{this.state.name}</Text>
            </View>
            <View style={styles.horiStyle}>
              <Button type="clear" icon={{name: "edit"}}/>
              <Text style={{lineHeight: 30}}>{"Email Address: "}{this.state.email}</Text>
            </View>
            <View style={styles.horiStyle}>
              <Button type="clear" icon={{name: "edit"}}/>
              <Text style={{lineHeight: 30}}>{"Team Number: "}{this.state.teamNo}</Text>
            </View>
            <View style={styles.horiStyle}>
              <Text style={{lineHeight: 30}}>{"Team Name: "}{this.state.teamName}</Text>
            </View>
            <View style={styles.horiStyle}>
              <Text style={{lineHeight: 30}}>{"Team Size: "}{this.state.teamInfo.size}</Text>
              </View>
            <View style={styles.horiStyle}>
              <Text style={{lineHeight: 30}}>{"Team Points: "}{this.state.teamInfo.points}</Text>
            </View>
            <View style={styles.horiStyle}>
              <Text style={{lineHeight: 30}}>{"Team ID: "}{this.state.teamInfo.id}</Text>
            </View>
            <View style={styles.horiStyle}>
              <Text style={{lineHeight: 30}}>{"UID: "} {this.state.user.uid}</Text>
            </View>
            <View style={styles.horiStyle}>
            <Button title='Change Password' type='clear' />
            </View>
            <Button title='Sign out' onPress={this.handleSignOut} type='clear' />
          </View>
        )}
        {!this.state.loggedIn && this.state.signUp && (
          <View>
            <Text h2 style={{ textAlign: 'center' }}>
              Sign Up
            </Text>
            <SignUpForm />
            <Button title="Already signed up? Click here to Log in!" onPress={this.handleSignIn} type="clear" />
          </View>
        )}
        {!this.state.loggedIn && !this.state.signUp &&(
          <View>
            <Text h2 style={{ textAlign: 'center' }}>
              Login
            </Text>
            <LoginForm />
            <Button title="New? Click here to Sign Up!" onPress={this.handleSignIn} type="clear" />
          </View>
        )}
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  vertiStyle: {
    margin: 1
  },
  horiStyle: {
    margin: 1,
    flexDirection: 'row',

  }
});

export default withFirebaseHOC(ProfileScreen)
