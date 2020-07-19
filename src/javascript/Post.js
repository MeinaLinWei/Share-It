import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core'
import '../css/Post.css';
import { db } from './Firebase';

function Post({postId, username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);

    const postComment = (event ) => {

    }

    useEffect(() => {
        let unsubscribe;

        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

    })
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
                                fontSize: "15px",
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
                <div className="post__comments__all">
                        {comments.map((comment) => (
                            <p>
                                <b>{comment.username}</b> {comment.text}
                            </p>
                        ))}
                    </div>
            </div>
            

        </div>
    )
}

export default Post
