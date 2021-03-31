// Import third-party dependencies
import React from 'react'
import { KeyboardAvoidingView, Alert } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'
import { Formik, ErrorMessage } from 'formik'

import { withFirebaseHOC } from '../../../config/Firebase'

// Component for profile screen in main navigation
class EditForm extends React.Component {
  constructor (props) {
    super(props)

    this.name = this.props.profileData.name
    this.email = this.props.profileData.email
    this.team = this.props.profileData.teamNo
    this.uid = this.props.profileData.uid
    this.teamname = props.teamName
    this.teampoints = props.teamPoints
    this.state = {
      name: props.name
    }
    this.user = this.props.profileData.user

    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleSignup = this.handleSignUp.bind(this)
  }

  handleUpdate (values, actions) {
    const { name, email, teamNo, pass, pass1, pass2 } = values
    const userData = {
      name: name,
      email: email,
      team: teamNo,
      pass: pass,
      pass1: pass1,
      pass2: pass2
    }
    // console.log('uid: ', this.props.profileData.uid)
    console.log('userData: ', userData)
    console.log('values', values)
    // console.log('email update: ', this.props.firebase.updateUserEmail("pcwa@uk.ed"))

    const firebaseDoc = this.props.firebase.userDoc(this.props.profileData.uid)
    if (userData.name !== this.name && userData.name !== '') {
      console.log('name change')
      firebaseDoc.update({ name: userData.name })
    } else { console.log('name not changed') }
    if (userData.email !== this.email && userData.email !== '') {
      if (userData.pass === '') {
        Alert('In order to change email, you must enter your current password.')
      } else {
        this.props.firebase.reAuthWithEmail(this.user, userData.email, userData.pass).then(() => {
          firebaseDoc.update({ email: userData.email }).catch((error) => { console.log(error) })
        }).catch((error) => { console.log(error) })
      }
      // console.log('this.user: ', this.user)
      this.user.updateEmail(userData.email).then(() => {
        console.log('successfully updated user')
      }).catch((error) => { console.log('error updating user: ', error) })
    } else console.log('email not changed')
    if (userData.pass1 !== '') {
      if (pass === '') {
        Alert('In order to change password, you must enter your current password')
      } else if (userData.pass1 !== userData.pass2) {
        Alert('New Passwords Do Not Match')
      } else {
        this.props.firebase.reAuthWithEmail(this.user, this.email, userData.pass).then(() => {
          this.props.firebase.changePassword(this.user, pass1).then(() => {
            console.log('password changed')
          }).catch((error) => { console.log(error) })
        }).catch((error) => { console.log(error) })
      }
    }

    // if(userData.teamNo !== this.teamNo && this.name != ""){
    //   firebaseDoc.update({team: userData.teamNo})
    // }
    // console.log('values: ', actions);
  }

  handleSignUp (values, actions) {
    const { name, email, team } = values
    const userData = {
      name: name,
      email: email,
      team: team
    }
    this.props.firebase.updateUser(userData).then(() => {
      if (this.props.navigate) this.props.navigate()
    })
      .catch(error => actions.setFieldError('general', error.message))
  }

  render () {
    console.log('Edit Profile!')
    console.log('uid: ', this.props.profileData.uid)

    return (
      <Formik
        initialValues={{ email: '', password: '', name: '', team: '' }}
//        onSubmit={(values, actions) => this.handleSignUp(values, actions)}
        onSubmit={(values, actions) => this.handleUpdate(values, actions)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <KeyboardAvoidingView behaviour='height'>

            <Input
              name='name'
              autoCapitalize='words'
              autoCompleteType='name'
              placeholder={`Name: ${this.name}`}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            <ErrorMessage name='name' />
            <Input
              type='pass'
              name='password'
              autoCapitalize='none'
              autoCompleteType='password'
              secureTextEntry
              placeholder='Password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.pass}
            />
            <Text style={{ padding: 10 }}>All below fields require password</Text>
            <Input
              type='email'
              name='email'
              autoCapitalize='none'
              autoCompleteType='email'
              placeholder={`Email: ${this.email}`}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />

            <Input
              type='pass'
              name='newPass1'
              autoCapitalize='none'
              autoCompleteType='password'
              secureTextEntry
              placeholder='New Password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.pass1}
            />
            <Input
              type='pass'
              name='newPass1'
              autoCapitalize='none'
              autoCompleteType='password'
              secureTextEntry
              placeholder='Confirm New Password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.pass2}
            />
            {/* <Input
              type='team'
              name='team'
              placeholder={`Team Number: ${this.team}`}
              onChangeText={handleChange('team')}
              onBlur={handleBlur('team')}
              value={values.team}
            />
            <Input
              type='teamname'
              name='teamname'
              placeholder={`Team Name: ${this.teamname}`}
              onChangeText={handleChange('teamname')}
              onBlur={handleBlur('teamname')}
              value={values.teamname}
            />
            <Input
              type='teampoints'
              name='teampoints'
              placeholder={`Team Points: ${this.teampoints}`}
              onChangeText={handleChange('teampoints')}
              onBlur={handleBlur('teampoints')}
              value={values.teampoints}
            /> */}
            <Button
              containerStyle={{
                padding: 10,
                overflow: 'hidden'
              }}
              onPress={handleSubmit}
              title='Save Changes'
            />
          </KeyboardAvoidingView>
        )}
      </Formik>
    )
  }
}

export default withFirebaseHOC(EditForm)
// Extra code for submit button add to Formik view if we would like users to update profile themselves
/* <Button
              containerStyle={{
                padding: 10,
                overflow: "hidden"
              }}
              onPress={handleSubmit}
              title="Save Changes"
            /> */
