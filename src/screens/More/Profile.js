// Import third-party dependencies
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-elements';

import SignUpForm from '../../components/SignUpForm';
import LoginForm from '../../components/LoginForm';
import EditForm from '../../components/EditForm';
import PassChangeForm from '../../components/PassChangeForm'

import { withFirebaseHOC } from '../../../config/Firebase';

// Component for profile screen in main navigation
class ProfileScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      signUp: false,
      editProfile: false,
      changePassword: false,
      user: undefined, 
      name: undefined,
      email: undefined,
      teamNo: undefined,
      teamName: undefined,
      teamInfo: [],
      uid: undefined,
      teamID: undefined,
      userInfo: [],
      userPoints: 0,
    }
  
    this.changePassword = this.changePassword.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
  }

  componentDidMount () {
    this.props.firebase.checkAuthUser(user => {
      let userData = [];  
      let teamData = [];
      let email;
      let name;
      let userPoints;
      let teamNo;
      let uid;
      let teamID;
        //console.log('user: ', user);
      if (user) {
        //define team info vars to load with database data
        this.props.firebase.getUser(user.uid).then(data => {
          userData = data.data();
          //console.log('userData: ', userData);
          email = data.data().email;
          name = data.data().name;
          teamNo = data.data().teamNumber;
          uid = user.uid;
          teamID = data.data().teamID;
          if(data.data().points){
            userPoints = data.data().points
          } else userPoints = 0
          // console.log('teamID', teamID)
          //Old team data method, from before we stored teamID in user document
          //this.getTeamName(data.data().team);
          if(teamID){
            teamData = this.getTeamInfo(teamID)
          }
          // console.log('teamData: ', teamData)
          this.setState({ 
            loggedIn: true, 
            user: user, 
            name: name,
            email: email, 
            teamNo: teamNo, 
            uid: uid,
            teamID: teamID,
            userPoints: userPoints
          });
        });
      }
      // console.log('this.state.teamID', this.state.teamID)
      if (this.state.teamID){
        this.setState({
          teamInfo: this.getTeamInfo(this.state.teamID)
        })
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
  getTeamInfo(teamID) {
    let teamInfo = [];
    this.props.firebase.getTeam(teamID).then(data => {
      teamInfo = data.data()
      //console.log('teamInfo', teamInfo)
      this.setState({
        teamInfo: teamInfo
      })
    })
    
    return teamInfo;
  }
  
  // handleEditDialog(dialogName){
  //   console.log('entering handleEditDialog');
  //   let title =  `Edit ${dialogName}`;
  //   let description =  `Enter new ${dialogName}`;
  //   let visible = true;
  //   <View style={styles.container}>
  //     <Dialog.Container visible={visible}>
  //       <Dialog.Title>{title}</Dialog.Title>
  //       <Dialog.Description>
  //         {description}
  //       </Dialog.Description>
  //       <Dialog.Input>
  //         text goes here
  //       </Dialog.Input>
  //       <Dialog.Button label="Cancel" onPress={() => {visible = false;}}/>
  //     </Dialog.Container>
  //   </View>
  // }

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
  
  handleEditProfile() {
    this.setState({editProfile: !this.state.editProfile})
    // if(this.state.loggedIn == true){
    //   this.setState({editProfile: true});
    // }
    // else{
    //   this.setState({editProfile: false});
    // }
  }

  changePassword() {
    this.setState({changePassword: !this.state.changePassword})
  }

  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation
    // Show either profile (if logged in) or log-in/sign-up page (if logged out)
    // Need to get edit dialogs working. Currently not.
    // console.log('this.state.teamInfo', this.state.teamInfo)
    // console.log('user: ', this.state.user)
    return (
      <> 
        {this.state.loggedIn && !this.state.editProfile && (
          <View style={styles.vertiStyle}>
            <View>
              <Text h3>{"Name: "}{this.state.name}</Text>
           
              <Text style={{lineHeight: 30}}>{"Email Address: "}{this.state.email}</Text>

              <Text style={{lineHeight: 30}}>{"Points: "}{this.state.userPoints}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Number: "}{this.state.teamInfo.number}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Name: "}{this.state.teamInfo.name}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Size: "}{this.state.teamInfo.size}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Points: "}{this.state.teamInfo.points}</Text>
           
              <Text style={{lineHeight: 30}}>{"Team ID: "}{this.state.teamID}</Text>
            
              <Text style={{lineHeight: 30}}>{"UID: "} {this.state.user.uid}</Text>
            
            </View>
            <Button type='clear' title='Change Password' onPress={this.changePassword} />
            {/* <Button type='clear' title='Edit Profile' 
              onPress={this.handleEditProfile}
            /> */}
            <Button type='clear' title='Sign out' onPress={this.handleSignOut}  />
          </View>
        )}
        {this.state.loggedIn && this.state.changePassword && (
          <PassChangeForm profileData = {{
            user: this.state.user
          }}/>
        )}
        {/* this.state.loggedIn && this.state.editProfile && (
          <EditForm profileData = {{
            user: this.state.user,
            name: this.state.name,
            email: this.state.email,
            teamNo: this.state.teamNo,
            uid: this.state.uid,
        }}/>
        ) */}
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
            <Button type="clear" title="New? Click here to Sign Up!" onPress={this.handleSignIn} />
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
    margin: 1,
    flex: 1
  },
  horiStyle: {
    margin: 1,
    flexDirection: 'row',

  }
});

export default withFirebaseHOC(ProfileScreen)
