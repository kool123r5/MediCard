const newInputBtn = document.getElementById('newInputBtn');
const form = document.getElementById('form');
const uploadInput = document.getElementById('uploadInput');
const textDiv = document.getElementById('textDiv');
const uploadPic = document.getElementById('uploadPic');
const facePicture = document.getElementById('facePicture');
const submitButton = document.getElementById('submitButton');
const nameInput = document.getElementById('exampleInputName1');
const emailInput = document.getElementById('exampleInputEmail1');
const residencyInput = document.getElementById('exampleInputResidency1');
const mainPhoneInput = document.getElementById('exampleInputPhone1');
const backupPhoneInput = document.getElementById('exampleInputHelpPhone1');
const dobInput = document.getElementById('exampleInputDOB1');

const db = firebase.firestore()
const auth = firebase.auth()

auth.onAuthStateChanged(user => {
    if (user) {

        newInputBtn.onclick = (e) => {
            e.preventDefault()
            const mainDiv = document.createElement('div')
            mainDiv.className = 'mb-3'
            const label = document.createElement('label')
            label.className = 'form-label'
            label.htmlFor = `exampleInputImportantInformation`
            label.innerHTML = 'Important Information (allergies, vaccines, prescriptions, past hospital visits)'
            const input = document.createElement('input')
            input.type = 'text'
            input.className = 'form-control exampleInputImportantInformation1'
            input.id = `exampleInputImportantInformation`
            input.style.width = '500px'
            mainDiv.appendChild(label)
            mainDiv.appendChild(input)
            form.append(mainDiv)
        }

        uploadInput.onchange = (e) => {
            console.log(e)
            var file = e.target.files[0]
            var storageRef = firebase.storage().ref(`${user.email}/importantPic/${file.name}`).put(file)
            storageRef.on('state_changed', snapshot => {

                db.collection('cardInfo').doc(`${user.email}`).get().then(doc => {
                    if (doc.exists) {
                        var impData = doc.data().prescriptionPictureURL
                    } else {
                        var impData = null
                    }

                    if (impData != null) {
                        snapshot.ref.getDownloadURL().then(url => {
                            db.collection('cardInfo').doc(`${user.email}`).update({
                                prescriptionPictureURL: firebase.firestore.FieldValue.arrayUnion(url)
                            })
                        })
                    } else {
                        snapshot.ref.getDownloadURL().then(url => {
                            db.collection('cardInfo').doc(`${user.email}`).set({
                                prescriptionPictureURL: [url]
                            }, {merge: true})
                        }) 
                    }
                })
            })
            const text = document.createElement('p')
            text.innerHTML = `Successfully uploaded ${file.name}, you can keep uploading more files!`
            textDiv.appendChild(text)
        }

        uploadPic.onchange = (e) => {
            console.log(e)
            var file = e.target.files[0]
            var faceImageRef = firebase.storage().ref(`${user.email}/facePic/${file.name}`).put(file)
            faceImageRef.on('state_changed', snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    db.collection('cardInfo').doc(`${user.email}`).update({
                        facePictureURL: url
                    })
                })
            })
            const success = document.createElement('p');
            success.innerHTML = `Successfully uploaded ${file.name}`
            facePicture.appendChild(success)
        }

        submitButton.onclick = (e) => {
            e.preventDefault();
            const { serverTimestamp } = firebase.firestore.FieldValue;
            const importantInfoInput = document.getElementsByClassName('exampleInputImportantInformation1');
            var importantInfoFinal  = [].map.call(importantInfoInput, function( input ) {
                return input.value;
            }).join( '|' );
            const nameInputValue = nameInput.value;
            const emailInputValue = emailInput.value;
            const residencyInputValue = residencyInput.value;
            const mainPhoneInputValue = mainPhoneInput.value;
            const backupPhoneInputValue = backupPhoneInput.value;
            const dobInputValue = dobInput.value;

            db.collection('cardInfo').doc(`${user.email}`).update({
                name: nameInputValue,
                email: emailInputValue,
                residency: residencyInputValue,
                phone: mainPhoneInputValue,
                backupPhone: backupPhoneInputValue,
                dateOfBirth: dobInputValue,
                createdAt: serverTimestamp(),
                importantInfo: importantInfoFinal
            })
            setTimeout(function(){ window.location = 'card.html'}, 2000)
        }

    } else {
        window.location = 'login.html'
    }
})