const signInWithGoogleBtn = document.getElementById('signInWithGoogleBtn');

const auth = firebase.auth()

const googleProvider = new firebase.auth.GoogleAuthProvider();

signInWithGoogleBtn.onclick = () => {
    auth.signInWithPopup(googleProvider)
}

auth.onAuthStateChanged(user => {
    if (user) {
        window.location = 'index.html'
    } else {
        
    }
})