import { errorMessages } from '../constants/messages';
import { Firebase, FirebaseRef } from '../lib/firebase';

/**
  * Sign Up to Firebase
  */
export function signUp(formData) {
  const {
    email, password, password2, firstName, lastName,
  } = formData;

  return () => new Promise(async (resolve, reject) => {
    // Validation rules
    if (!firstName) return reject({ message: errorMessages.missingFirstName });
    if (!lastName) return reject({ message: errorMessages.missingLastName });
    if (!email) return reject({ message: errorMessages.missingEmail });
    if (!password) return reject({ message: errorMessages.missingPassword });
    if (!password2) return reject({ message: errorMessages.missingPassword });
    if (password !== password2) return reject({ message: errorMessages.passwordsDontMatch });

    // Go to Firebase
    return Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // Send user details to Firebase database
        if (res && res.user.uid) {
          FirebaseRef.child(`users/${res.user.uid}`).set({
            firstName,
            lastName,
            signedUp: Firebase.database.ServerValue.TIMESTAMP,
            lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
          }).then(resolve);
        }
      }).catch(reject);
  }).catch((err) => { throw err.message; });
}

/**
  * Get this User's Details
  */
function getUserData(dispatch) {
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
  return dispatch => new Promise((resolve, reject) => Firebase.auth().signOut()
    .then(() => resolve(dispatch({ type: 'USER_RESET' })))
    .catch(reject)).catch((err) => { throw err.message; });
}
