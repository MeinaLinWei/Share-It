import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core'
import '../css/Post.css';
import { db } from './Firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);

    const postComment = (event ) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName, // use username of user currently signed in
            timestamp:firebase.firestore.FieldValue.serverTimestamp() // use firebase universal time
        });

        setComment(''); // set setComment back to empty
    }

    useEffect(() => {
        let unsubscribe;

        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","asc") // sort posts in ascending order based on firebase time
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        }
    }, [postId]);


    return (
        <div className="post">
            <div className="post__username-picture">
                <div className="post__header">
                    <Avatar 
                        className="post__avatar"
                        alt={username}
                        src="" 
                    />
                    {/* username of current user*/}
                    <h3>{username}</h3>
                </div>
                {/* image */}
                <img src={imageUrl} className="post__image"></img>
            </div>

            <div className="post__username-caption">
                {/* Username and Caption*/}
                <h4 className="post__caption"><strong>{username}</strong>: {caption}</h4>

                {/* current user wishing to post a comment on a picture */}
                {user && 
                <div className="post__comment">
                    <form>
                        <input
                            className="post__comment-input"
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                        />
                        <Button
                            style={{
                                fontSize: "13px",
                                color: "#314455",
                            }}
                            className="post__comment-button"
                            disabled={!comment}
                            type="submit"
                            onClick={postComment}
                        >
                        Post
                    </Button>
                    </form>
                </div>
                }

                {/* display all exisitng comments */}
                <div className="post__comment-all">
                        {comments.map((comment) => (
                            <p>
                                <b>{comment.username}</b>: {comment.text}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Post
