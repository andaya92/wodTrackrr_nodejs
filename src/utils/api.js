import firebase from "../context/firebaseContext"
import "firebase/auth"; 
import "firebase/storage";
import "firebase/database"; 
var storage = firebase.storage()
var db = firebase.database();



function formatDate(){
  const [{ value: month },,{ value: day },,{ value: year }] 
    = new Intl.DateTimeFormat('en', 
      { year: 'numeric', month: 'numeric', day: '2-digit' })
      .formatToParts(new Date())  
  console.log(new Intl.DateTimeFormat('en', 
      { year: 'numeric', month: 'numeric', day: '2-digit' }))
  return `${year}/${month}/${day}`
}

export default async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


export async function getImagePreview(fileObjs) {
  return await Promise.all(fileObjs.map(fileObj => {
    return new Promise((res, rej) => {
      const reader = new FileReader();  
  
      reader.onload = (evt) => {
        res(evt)
      }
      // add error event
      reader.readAsDataURL(fileObj)
      }) 
  }))
  
  
}


export function postCaptionUpload(ts, caption){
  let DBRef = db.ref(`posts/${ts}/`)
  DBRef.child('caption')
  .set(caption)
  .then( () => {
    console.log("Caption uploaded")
  })
  .catch(err => { console.log(err) })
}

export function postMediaUpload(fileObj, ts, i) {
  const reader = new FileReader();  
  console.log(fileObj, ts, i)
  let DBRef = db.ref(`posts/${ts}/`)
  let fileType = fileObj.type.split('/')[0]
  reader.onload = (evt) => {
    // Use Firebase API here to directly upload file?
    storage.ref()
    .child(`posts/${ts}/${fileObj.name}`)
    .put(fileObj)
    .then(snapshot => {
      if(snapshot){
        console.log(snapshot)
        DBRef.child(`media/${i}`)
        .update({
          type: fileType,
          url: snapshot.metadata.fullPath 
        })
        .then( () => {
          console.log('File uploaded')
        })
        .catch( err => { console.log(err) })
      }

    })
    .catch(err => {console.log(err)})
  }
  reader.readAsDataURL(fileObj)
}

export async function downloadPostMedia(imgPaths){
    return await Promise.all(imgPaths.map(imgObj => {
      console.log(imgObj.get('path'))
      return new Promise((res, rej) => {
        storage.ref(imgObj.get('path')).getDownloadURL()
        .then(url => {
          console.log(url)
          res(new Map([['path', imgObj.get('path')], ['url', url], ['type', imgObj.get('type')] ]))
        }).catch(err => {rej(err)})
      })
    }))
}


/* not in use */

export function websiteImageUpload(title, file) {
  const reader = new FileReader();  

  let setNameDBRef = db.ref(`website/images`)
  
  reader.onload = (evt) => {
    // Use Firebase API here to directly upload file?
    storage.ref()
    .child(`website/images/${title}`)
    .put(file)
    .then(snapshot => {
      let stripped = snapshot.metadata.fullPath
      .replace(new RegExp(/\//, 'g'), "")
      .replace(".", "")
      
      // see if image object exits, preserve original upload date
      setNameDBRef.child(stripped)
      .once('value')
      .then( setNameImageSnapshot => {
          let fmtDate =  null // preserve original date
          if(setNameImageSnapshot.val()){
            fmtDate = setNameImageSnapshot.val().date
          }else{
            const date = new Date()
            const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' }) 
            const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date )  
            fmtDate = `${year}/${month}/${day}` 
          }

          setNameDBRef.child(stripped).set({
            "date": fmtDate,
            "path": snapshot.metadata.fullPath 
          })
      } )

    })
    .catch(err => {console.log(err)})
  }
  reader.readAsDataURL(file)
}

export async function downloadWebsiteImages(imgPaths){
    return await Promise.all(imgPaths.map(imgObj => {
      
      return new Promise((res, rej) => {
        storage.ref(imgObj.path).getDownloadURL()
        .then(url => {
          res(url)
        }).catch(err => {rej(err)})
      })
    }))
}

/* not in use */

function setThumbUploadHelper(setName, title, file){
  /*
    Uploads the file and file data to database 
  */

  //upload 
  let thumbStorageRef = storage.ref().child(`thumbnails/${setName}/${title}`);
  let setThumbDBRef = db.ref(`thumbnails/${setName}/`)

  // store file data
  thumbStorageRef.put(file)
  .then(snapshot => {
    let stripped = snapshot.metadata.fullPath.replace(new RegExp(/\//, 'g'), "").replace(".", "")
    /* key: value ------ stippped: fullPath ----- pathtoimg1: path/to/img1  */
    setThumbDBRef.child(stripped).set(snapshot.metadata.fullPath)
  })
}

/* checks if thumbnail exists */ 
export function setThumbUpload(setName, title, file) {
  const reader = new FileReader();  
  /*
    If setName exists, delete and upload if not just upload
  */
  let setThumbDBRef = db.ref(`thumbnails/${setName}/`)
  
  reader.onload = (evt) => {
    setThumbDBRef.once("value")
    .then( ss => {
      if(ss.exists()){
          //delete
          setThumbDBRef.remove()
          .then(() => {
            let thumbStorageRef = storage.ref(`thumbnails/${setName}`)
            // Ensure all previous entries are deleted. Settings will not work because files names will be different.
            thumbStorageRef.listAll()
            .then((res) => {
              res.items.forEach(item => {
                item.delete()
                .then(() => {
                  // database entry is gone, remove file from storage
                  setThumbUploadHelper(setName, title, file)
                })
                .catch(err => {console.log(err)})
              })
            })
            .catch(err => {console.log(err)})
          })
          .catch(err => { console.log(err) })
      }else{
         setThumbUploadHelper(setName, title, file)
      }
    })
  };
  reader.readAsDataURL(file);
}

export async function downloadSetThumbImage(setName){ 
  let thumbSnapshot = await db.ref(`thumbnails/${setName}`).once('value')
  let thumbnailFullPath = Object.values(thumbSnapshot.val())[0]
  return await storage.ref(thumbnailFullPath).getDownloadURL()
}

/* use img and throbber to create progress indicator */
export function setImageUpload(setName, title, file) {
  const reader = new FileReader();  
  let setNameDBRef = db.ref(`images/${setName}`)
  reader.onload = (evt) => {
    // Use Firebase API here to directly upload file
    storage.ref().child(`images/${setName}/${title}`)
    .put(file)
    .then(snapshot => {
      let stripped = snapshot.metadata.fullPath
      .replace(new RegExp(/\//, 'g'), "")
      .replace(".", "")
      // see if image object exits, preserve original upload date
      setNameDBRef.child(stripped).once('value')
      .then( setNameImageSnapshot => {
          let fmtDate =  null
          setNameImageSnapshot.val()
          ? 
            fmtDate = setNameImageSnapshot.val().date
          :
            fmtDate = formatDate()
          
          setNameDBRef.child(stripped).set({
            "date": fmtDate,
            "path": snapshot.metadata.fullPath 
          })
      } )
    })
    .catch(err => {console.log(err)})
  };
  reader.readAsDataURL(file);
}

/*
  Given array of image paths, fetch image url from Firebase Storage using img path
  Air Bnb doc
  https://peterpalau.github.io/react-bnb-gallery/#/options
  Firebase:
    Data return alphabetically, so images are sorted by name by default
*/
export async function downloadSetNameImages(imgPaths){
  return await Promise
  .all(imgPaths
    .map((imgObj, i)=>{
      return new Promise(
        (res, rej) => {
          console.log(imgObj.path)
          storage.ref(imgObj.path).getDownloadURL()
          .then(url => {
            /* Image object doumented in react Air BnB Gallery */
            res({
              photo: url,
              number: i,
              caption: imgObj.path.split("/").reverse()[0].split(".")[0],
              subcaption: imgObj.date,
              thumbnail: url
            })
          }).catch(err=>{rej(err)}) 
        }
      )
    })
  )
}