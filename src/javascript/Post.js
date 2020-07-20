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
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });

        setComment('');
    }

    useEffect(() => {
        let unsubscribe;

        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","asc")
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
            <div className="post__username__picture">
                <div className="post__header">
                    <Avatar 
                        className="post__avatar"
                        alt={username}
                        src="" 
                    />
                    {/* Username */}
                    <h3>{username}</h3>
                </div>
                {/* Image*/}
                <img src={imageUrl} className="post__image"></img>
            </div>

            <div className="post__username__caption">
                {/* Username + Caption*/}
                <h4 className="post__text"><strong>{username}</strong>: {caption}</h4>

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
                
                <div className="post__comments-all">
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
