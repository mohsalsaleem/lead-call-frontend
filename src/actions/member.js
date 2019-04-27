import { errorMessages } from '../constants/messages';
import { AsyncStorage } from 'react-native';
import { Firebase, FirebaseRef } from '../lib/firebase';
import axios from 'axios';

/**
  * Sign Up to Firebase
  */
export function signUp(formData) {
  const {
    name,
    email,
    businessName,
    mobileNumber,
    bizAlias,
    password,
    password2
  } = formData;

  return () => new Promise(async (resolve, reject) => {
    // Validation rules
    if (!name) return reject({ message: errorMessages.missingLastName });
    if (!email) return reject({ message: errorMessages.missingEmail });
    if (!businessName) return reject({ message: errorMessages.missingBusinessName})
    if (!bizAlias) return reject({ message: errorMessages.missingBusinessAlias})
    if (!mobileNumber) return reject({ message: errorMessages.missingMobileNumber})
    if (!password) return reject({ message: errorMessages.missingPassword });
    if (!password2) return reject({ message: errorMessages.missingPassword });
    if (password !== password2) return reject({ message: errorMessages.passwordsDontMatch });

    console.log('Onboarding User')
    console.log({
      biz_alias: bizAlias,
      biz_name: businessName,
      email_id: email,
      mobile_number: mobileNumber,
      name: name,
      password: password
    })
    fetch('10.1.122.181:5000/user/onboarding',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        biz_alias: bizAlias,
        biz_name: businessName,
        email_id: email,
        mobile_number: mobileNumber,
        name: name,
        password : password
      }),
    }).then((res) => {
                 console.log(res)
                 if (res && res.user_id) {
                   //AsyncStorage.setItem('user_id', res.user_id)
                   console.log('Created User ' + res.user_id)
                 }
               }).catch(reject)
    }).catch((err) => { console.log(err.message) });
}

/**
  * Get this User's Details
  */

function getUserData(dispatch) {
  console.log(1)
  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  const ref = FirebaseRef.child(`users/${UID}`);

  return ref.on('value', (snapshot) => {
    const userData = snapshot.val() || [];

    return dispatch({ type: 'USER_DETAILS_UPDATE', data: userData });
  });
}

export function getMemberData() {
  console.log(2)
  if (Firebase === null) return () => new Promise(resolve => resolve());

  // Ensure token is up to date
  return dispatch => new Promise((resolve) => {
    Firebase.auth().onAuthStateChanged((loggedIn) => {
      if (loggedIn) {
        return resolve(getUserData(dispatch));
      }

      return () => new Promise(() => resolve());
    });
  });
}

/**
  * Login to Firebase with Email/Password
  */
export function login(formData) {
  console.log(3)
  const { email, password } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation rules
    if (!email) return reject({ message: errorMessages.missingEmail });
    if (!password) return reject({ message: errorMessages.missingPassword });

    if(email === '9629278917' && password === 'helloworld') {
      resolve()
    } else {
      reject({ message: 'Invalid credentials' })
    }
  }).catch((err) => { throw err.message; });
}

/**
  * Reset Password
  */

export function resetPassword(formData) {
  console.log(4)
  const { email } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation rules
    if (!email) return reject({ message: errorMessages.missingEmail });

    // Go to Firebase
    return Firebase.auth().sendPasswordResetEmail(email)
      .then(() => resolve(dispatch({ type: 'USER_RESET' })))
      .catch(reject);
  }).catch((err) => { throw err.message; });
}

/**
  * Update Profile
  */
export function updateProfile(formData) {
  console.log(5)
  const {
    email, password, password2, firstName, lastName, changeEmail, changePassword,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Are they a user?
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return reject({ message: errorMessages.missingFirstName });

    // Validation rules
    if (!firstName) return reject({ message: errorMessages.missingFirstName });
    if (!lastName) return reject({ message: errorMessages.missingLastName });
    if (changeEmail) {
      if (!email) return reject({ message: errorMessages.missingEmail });
    }
    if (changePassword) {
      if (!password) return reject({ message: errorMessages.missingPassword });
      if (!password2) return reject({ message: errorMessages.missingPassword });
      if (password !== password2) return reject({ message: errorMessages.passwordsDontMatch });
    }

    // Go to Firebase
    return FirebaseRef.child(`users/${UID}`).update({ firstName, lastName })
      .then(async () => {
        // Update Email address
        if (changeEmail) {
          await Firebase.auth().currentUser.updateEmail(email).catch(reject);
        }

        // Change the password
        if (changePassword) {
          await Firebase.auth().currentUser.updatePassword(password).catch(reject);
        }

        // Update Redux
        return resolve(getUserData(dispatch));
      }).catch(reject);
  }).catch((err) => { throw err.message; });
}

/**
  * Logout
  */
export function logout() {
  console.log(6)
  return dispatch => new Promise((resolve, reject) => Firebase.auth().signOut()
    .then(() => resolve(dispatch({ type: 'USER_RESET' })))
    .catch(reject)).catch((err) => { throw err.message; });
}
