const yourNameTextId = document.getElementById('yourNameTextId');
const residencyId = document.getElementById('residencyId');
const phoneNumberMainId = document.getElementById('phoneNumberMainId');
const emailId = document.getElementById('emailId');
const faceId = document.getElementById('faceId');
const medicalReportLinkBtn = document.getElementById('medicalReportLinkBtn');
const downloadBtn = document.getElementById('downloadBtn');

const auth = firebase.auth()
const db = firebase.firestore()

faceId.hidden = true;

auth.onAuthStateChanged(user => {
    if (user) {
        
        db.collection('cardInfo').doc(`${user.email}`).get().then(doc => {
            if (doc.exists) {

                yourNameTextId.innerHTML = `${doc.data().name}`
                residencyId.innerHTML = `${doc.data().residency}`
                phoneNumberMainId.innerHTML = `${doc.data().phone}`
                emailId.innerHTML = `${doc.data().email}`
                faceId.hidden = false;
                faceId.src = `${doc.data().facePictureURL}`

            } else {
                yourNameTextId.innerHTML = ` <a href="makingCard.html">Fill form out!</a>`
            }
        })

        medicalReportLinkBtn.onclick = (e => {
            e.preventDefault();
            window.location = 'medicalReport.html'
        })

        downloadBtn.onclick = (e) => {
            e.preventDefault();

            const screenshotTarget = document.getElementById('vishu');

            html2canvas(screenshotTarget, {allowTaint: true, useCORS: true}).then((canvas) => {
                const base64image = canvas.toDataURL("image/png");
                window.location.href = base64image;
                var splitImage = base64image.split(",")[1]
                var downloadImageRef = firebase.storage().ref('/things').child(`${user.email}-card.png`).putString(splitImage, 'base64', {contentType:'image/png'});
                downloadImageRef.on('state_changed', snapshot => {
                    snapshot.ref.getDownloadURL().then(url => {
                        console.log(url)
                        window.open(url, '_blank')
                    })
                })
            });
        }

    } else {
        window.location = 'login.html'
    }
})