import React from 'react'
import { Text, Input, Button } from 'react-native-elements'
import { Formik, ErrorMessage } from 'formik'
import { Alert,StyleSheet } from 'react-native'
import { render } from 'react-dom'
import { withFirebaseHOC } from '../../../config/Firebase'

class PassChangeForm extends React.Component {

	render() {
		console.log("change Password Screen")
		return null
	}
}

const styles = StyleSheet.create({

})
export default withFirebaseHOC(PassChangeForm)