import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

firebase.initializeApp(firebaseConfig)

const Firebase = {
  // auth
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
  },
  signOut: () => {
    return firebase.auth().signOut()
  },
  checkAuthUser: (user) => {
    return firebase.auth().onAuthStateChanged(user)
  },
  // firestore
  createNewUser: userData => {
    return firebase
      .firestore()
      .collection('users')
      .doc(`${userData.uid}`)
      .set(userData)
  },
  getTeams: () => {
    return firebase
      .firestore()
      .collection('teams')
      .get()
  },
  getSponsors: () => {
    return firebase
      .firestore()
      .collection('sponsors')
      .get()
  },
  getActiveCountdown: () => {
    return firebase
      .firestore()
      .collection('countdowns')
      .where('active', '==', true)
      .get()
  },
  getAnnouncements: () => {
    return firebase
      .firestore()
      .collection('announcements')
      .get()
  },
  // Old getUser method, didn't really work.
  // getUser: (userId) => {
  //   return firebase
  //     .firestore()
  //     .collection('users')
  //     .where('uid', '==', userId)
  //     .get()
  // },
  // Returns a promise for a user document, by UID.
  getUser: (userId) => {
    return firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
  },
  //Returns a promise for a team document, by team ID.
  getTeam: (teamId) => {
    return firebase
      .firestore()
      .collection('teams')
      .doc(teamId)
      .get()
  },
  // This can be used to pull team information based on user's team number.
  getTeamByNumber: (teamNo) => {
    return firebase
      .firestore()
      .collection('teams')
      .where('number', '==', teamNo)
      .get()
  },
  // cloud storage
  getDocumentURL: path => {
    return firebase
      .storage()
      .ref(path)
      .getDownloadURL()
  }
}

export default Firebase
