import React, {useState, useEffect} from 'react';
import Post from './Post';
import Logo from "./logo5.svg";
import Cat from "./cat.jpg";
import './App.css';
import { db, auth } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input, handleLogin } from '@material-ui/core';


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
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([
    {/*
      username:"Hypedinburgh",
      caption: "Social distancing each letters cause why not?",
      imageUrl: Logo
    },
    {
      username: "Lina", 
      caption: "Waaaaa cute kitties",
      imageUrl: "https://news.cgtn.com/news/77416a4e3145544d326b544d354d444d3355444f31457a6333566d54/img/37d598e5a04344da81c76621ba273915/37d598e5a04344da81c76621ba273915.jpg"
    */}
  ]);

  const[open, setOpen] = useState(false); // default value is false
  const[username, setUsername] = useState(''); 
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[user, setUser] = useState(null);


  useEffect(()=>{ // treat this listener as the frontend listener
    // treat everything below as the backend listener
    const unsubscribe = auth.onAuthStateChanged((authUser) => { 
      // auth.OnAuthStateChanged is a listerner and each time a change is made, it will run the folowung code.
      if (authUser) {
        // user is logged in.
        console.log(authUser);
        setUser(authUser); // it will not be affected when the website refreshes because of cookies because of auth.onAuthStateChanged
      } else {
        // user is logged out.
        setUser(null); // if the user is logged out, set the user back to null.
      }
    }) 

    return () => {
      // if the useEffect is run again, performs some cleanup before the run is re-run.
      unsubscribe();
    }

  }, [user, username]);

  // useEffect runs a piece of code based on a specific condition. For e.g: runs code when teh page refreshes
  useEffect(()=> {
    
    // onSnapshot: every time a new post is added to the database, it is going to update and the code below will run.
    db.collection('posts').onSnapshot(snapshot => {
      // map: a function that loops through every doc, just like a for-loop
      // data: all the properties of the document. In this case- caption, username, imageUrl
      setPosts(snapshot.docs.map(doc => doc.data())); 
    })

  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=>alert(error.message))
  };

  {/* 
    [] is variable and if we leave it blank, this means that the code will run once
    when the App component loads, and will not run again.

    [posts] means that the App component will run one time and run again when the details of posts changes
*/}

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      
      <div style={modalStyle} className={classes.paper}>
        <center>
        <form className="app__signup">
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
          <Button type="submit" onClick={signUp}>Submit</Button>

        </form>
        </center>
      </div>
 
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img 
          className="app__header__Image"
          src={Logo}
          alt=""
        />

      <div className="nav">

      { user ? (
        <Button 
          style={{
            fontSize: "15px",
            color: "#eae7dc"
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
            color: "#eae7dc"
          }}
          onClick={() => setOpen(true)}
        >
          Log In
        </Button>
        <Button 
          style={{
            fontSize: "15px",
            color: "#eae7dc"
          }}
          onClick={() => setOpen(true)}
        >
          Register
        </Button>
        </div>
      )}
      </div>
      </div>

      {
        posts.map(post => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }

      {/*
        Hypedinburgh" caption="Social distancing each letters cause why not?" imageUrl={Logo}/>
        <Post username="Lina" caption="Waaaaa cute kitties" imageUrl={Cat}/>
      */}


    </div>
  );
}

export default App;
