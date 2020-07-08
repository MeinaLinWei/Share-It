import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Logo from "./0.jpeg";
import './Post.css';

function Post({username, caption, imageUrl}) {
    return (
        <div className="post">
            <div className="post__header">
                {/* Avater from Material UI*/}
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg" 
                />
                 {/* Username */}
                <h3>{username}</h3>
            </div>
            {/* Image*/}
            <img src={imageUrl} className="post__image"></img>

            {/* Username + Caption*/}
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
        </div>
    )
}

export default Post
