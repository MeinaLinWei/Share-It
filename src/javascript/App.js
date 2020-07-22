import React, {useState, useEffect} from 'react';
import { db, auth } from './Firebase';
import '../css/App.css';
import Logo from "../images/logo.svg";
import Post from './Post';
import UploadImage from './UploadImage'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';


function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false); // default value is false

    // user registration and authentication using firebase
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [user, setUser] = useState(null); // default value is null

    const [openLogIn, setOpenLogIn] = useState(false);


    // listener (front-end)
    useEffect(()=>{ 
        // listener (back-end)
        const unsubscribe = auth.onAuthStateChanged((authUser) => { // auth.OnAuthStateChanged is a listerner. Each time a change is made, it will run the folowung code.
            if (authUser) {
                // user is logged in
                setUser(authUser); // it will not be affected when the website refreshes because of cookies and of auth.onAuthStateChanged
            } else {
                // user is logged out
                setUser(null); // setUser back to null
            }
        }) 

        return () => {
        // if the useEffect is run again, performs some cleanup before the listener (back-end) is re-run
            unsubscribe();
        }
    }, [user, username]);


    // useEffect runs a piece of code based on a specific condition. For e.g: runs code when teh page refreshes
    useEffect(()=> {
        
        // onSnapshot: every time a new post is added to the database, it is going to update and the code below will run.
        db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot => {
        // map: a function that loops through every doc, just like a for-loop
        // data: all the properties of the document. In this case: caption, username, imageUrl
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            }))); 
        })
    }, []);
    {/* 
        [] is variable and if we leave it blank, this means that the code will run once
        when the App component loads, and will not run again.

        [posts] means that the App component will run one time and run again when the details of posts changes
    */}


    // user registration using firebase
    const register = (event) => {
        event.preventDefault();

        auth
        .createUserWithEmailAndPassword(email,password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error) => alert(error.message))

        setOpen(false);
    };


    // user authentication/sigin using firebase
    const logIn = (event) => {
        event.preventDefault();
        
        auth
        .signInWithEmailAndPassword(email, password)
        .then ((authUser) => {})
        .catch((error) => alert(error.message))

        setOpenLogIn(false);
        setEmail("");
        setPassword("");
    };


    return (
        <div className="app">

        <Modal
            open={openLogIn}
            onClose={() => setOpenLogIn(false)}
        >

            {/* login form using modal from material.ui */}
            <div style={modalStyle} className={classes.paper}>
                <center>
                    <div className="app__login-register-welcome-text">
                        Welcome back to SHARE IT! 
                        <br></br>
                        It's nice to see you again 😄
                    </div>

                    <form className="app__login-register">
                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <br></br>

                        <Button type="submit" onClick={logIn}>Submit</Button>
                    </form>
                </center>
            </div>

        </Modal>

        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
        
            {/* registration form using modal from material.ui */}
            <div style={modalStyle} className={classes.paper}>
                <center>
                    <div className="app__login-register-welcome-text">
                        Welcome to SHARE IT ✨ 
                        <br></br>
                        Please complete the form below to become a member.
                    </div>

                    <form className="app__login-register">
                        <Input
                            placeholder="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <br></br>

                        <Button type="submit" onClick={register}>Submit</Button>
                    </form>
                </center>
            </div>
    
        </Modal>

        {/* Header */}
        <div className="app__header"><a href=""><img className="app__header-image" src={Logo} alt="" /></a>
            <div className="nav">
                { user ? ( // check if user is signed in or not. ? (...) : (...) is an if-else statement
                    <Button 
                        style={{
                            fontSize: "15px",
                            color: "#edeae5"
                        }}
                        onClick={() => auth.signOut()}
                    >
                        Log Out
                    </Button>
                ) : (
                    <div>
                        <Button 
                            style={{
                                fontSize: "15px",
                                color: "#edeae5"
                            }}
                            onClick={() => setOpenLogIn(true)}
                        >
                            Log In
                        </Button>

                        <Button 
                            style={{
                                fontSize: "15px",
                                color: "#edeae5"
                            }}
                            onClick={() => setOpen(true)}
                        >
                            Register
                        </Button>
                    </div>
                )}
            </div>
        </div>

        <div className="app__upload">
            {user?.displayName ? ( // the ? is an optional, basically a try catch statement
                <UploadImage username={user.displayName}/>
            ) : (
                <div />
            )}
        </div>
    
        {
            posts.map(({id, post}) => (
                <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
        }

        </div>
    );
}

export default App;
