
const faceGeneralInfoPic = document.getElementById('faceGeneralInfoPic');
const nameGeneralInfo = document.getElementById('nameGeneralInfo');
const emailGeneralInfo = document.getElementById('emailGeneralInfo');
const phoneGeneralInfo = document.getElementById('phoneGeneralInfo');
const dobGeneralInfo = document.getElementById('dobGeneralInfo');
const residencyGeneralInfo = document.getElementById('residencyGeneralInfo');
const backupPhoneGeneralInfo = document.getElementById('backupPhoneGeneralInfo');
const faceGeneralInfo = document.getElementById('faceGeneralInfo');
const importantInfoContent = document.getElementById('importantInfoContent');
const pics = document.getElementById('files');

const auth = firebase.auth()
const db = firebase.firestore()

faceGeneralInfoPic.hidden = true;

auth.onAuthStateChanged(user => {
    if (user) {
        
        db.collection('cardInfo').doc(`${user.email}`).get().then(doc => {
            if (doc.exists) {

                nameGeneralInfo.innerHTML = `Name: ${doc.data().name}`
                emailGeneralInfo.innerHTML = `Email: ${doc.data().email}`
                phoneGeneralInfo.innerHTML = `Phone: ${doc.data().phone}`
                dobGeneralInfo.innerHTML = `Date of Birth: ${doc.data().dateOfBirth}`
                residencyGeneralInfo.innerHTML = `Residency: ${doc.data().residency}`
                backupPhoneGeneralInfo.innerHTML = `Backup Phone: ${doc.data().backupPhone}`
                faceGeneralInfoPic.hidden = false;
                faceGeneralInfoPic.src = `${doc.data().facePictureURL}`

                var importantInfoString = doc.data().importantInfo
                var importantInfoStringReplaced = importantInfoString.replaceAll("|", "; ")
                importantInfoContent.innerHTML = importantInfoStringReplaced

                doc.data().prescriptionPictureURL.forEach((url) => {
                    var newImage = document.createElement('img');
                    newImage.height = 200
                    newImage.width = 200
                    newImage.src = `${url}`
                    pics.appendChild(newImage)
                })

            } else {
                yourNameTextId.innerHTML = ` <a href="makingCard.html">Fill form out!</a>`
            }
        })

    } else {
        window.location = 'login.html'
    }
})
