import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from './Firebase';
import firebase from "firebase";
import '../css/UploadImage.css';

function UploadImage(username) { // destructuring 
    const [caption, setCaption] = useState('');
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) => { // e: event, handleChange: a function
        if (e.target.files[0]) { // get the first file you have selected and 
            setImage(e.target.files[0]); // set the image in state to it.
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image); // access the storage in firebase and get a reference of the folder-images .name is the name of the file to uploaded and will be stored in the folder images in firebase. .put does put the image in the folder. basically uploading it to firebase storage
        uploadTask.on(
            "state_changed",
            
            (snapshot) => {
                //progress function
                progress = Math.round(
                    (snapshot.bytesTransfered / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            
            (error) => {
                // error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL() // get the Download link of the file from firebase
                .then((url) => {
                    // post the image inside the database
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(), // regardless where you are in the world, the firebase timestamp is consistent.
                        caption: caption,
                        imageUrl: url, // take the download link and put it into the firebase database.
                        username: username
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )

    }

    return (
        <div className="upload-image">
            <input 
                className="upload-image--link"
                type="file" 
                onChange={handleChange} 
            />
            <br />

            {/*<progress value={progress} max="100" /> */}
            <input 
                className="upload-image--caption"
                type="text" 
                placeholder="Caption:" 
                onChange={event => setCaption(event.target.value)} 
                value={caption} 
            />
            <br />
            
            <Button 
                style={{
                    fontSize: "15px",
                    color: "#314455",
                    marginBottom: "20px",
                    padding:"10px 20px"
                }}
                onClick={handleUpload}
            >
                Upload ↥ 
            </Button>
        </div>
    )
}

export default UploadImage
