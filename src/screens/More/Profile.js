// Import third-party dependencies
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-elements';

import SignUpForm from '../../components/SignUpForm';
import LoginForm from '../../components/LoginForm';
import EditForm from '../../components/EditForm';

import { withFirebaseHOC } from '../../../config/Firebase';

// Component for profile screen in main navigation
class ProfileScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false,
      signUp: false,
      editProfile: false,
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
    this.handleEditProfile = this.handleEditProfile.bind(this);
  }

  componentDidMount () {
    this.props.firebase.checkAuthUser(user => {
        let email;
        let name;
        let teamNo;
        let teamName;
        let uid;
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
    // console.log('getTeamName teamNo = ', teamNo);
    // console.log('teamNo === undefined?', (teamNo === undefined))
    // let num = Number(teamNo);
    // console.log('num = ', num);
    // if(num != NaN){
    //   this.props.firebase.getTeam( 1 )
    //     .then((querySnapshot) => {
    //     //console.log('querySnapshot: ', querySnapshot)
    //   querySnapshot.forEach((doc) => { //Everything seems to work until this point. I get no output.
    //     console.log("doc: ", doc);
    //     console.log('doc.id    doc.data()')
    //     console.log(doc.id, ' => ', doc.data());
    //     console.log("team info:", )
    //   });
    // })
    // .catch((error) => {
    //   console.log("Error getting documents: ", error);
    // });
    // }
      
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

  render () {
    /* eslint-disable */
    const { navigate } = this.props.navigation
    // Show either profile (if logged in) or log-in/sign-up page (if logged out)
    // Need to get edit dialogs working. Currently not.
    return (
      <> 
        {this.state.loggedIn && !this.state.editProfile && (
          <View style={styles.vertiStyle}>
            <View>
              <Text h3>{"Name: "}{this.state.name}</Text>
           
              <Text style={{lineHeight: 30}}>{"Email Address: "}{this.state.email}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Number: "}{this.state.teamNo}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Name: "}{this.state.teamName}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Size: "}{this.state.teamInfo.size}</Text>
            
              <Text style={{lineHeight: 30}}>{"Team Points: "}{this.state.teamInfo.points}</Text>
           
              <Text style={{lineHeight: 30}}>{"Team ID: "}{this.state.teamInfo.id}</Text>
            
              <Text style={{lineHeight: 30}}>{"UID: "} {this.state.user.uid}</Text>
            
            </View>
            <Button type='clear' title='Change Password' onPress={() => Alert.alert("Change Password", "This will be a change password screen")} />
            <Button type='clear' title='Edit Profile' 
              onPress={this.handleEditProfile}
            />
            <Button type='clear' title='Sign out' onPress={this.handleSignOut}  />
          </View>
        )}
        {this.state.loggedIn && this.state.editProfile && (
          <EditForm profileData = {{
            name: this.state.name,
            email: this.state.email,
            teamNo: this.state.teamNo,
            uid: this.state.uid,
        }}/>
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
