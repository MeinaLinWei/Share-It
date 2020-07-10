import React, {useState, useEffect} from 'react';
import Post from './Post';
import Logo from "./logo5.svg";
import Cat from "./cat.jpg";
import './App.css';
import { db } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';


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

  const[open, setOpen] = useState(false);

  // useEffect runs a piece of code based on a specific condition. For e.g: runs code when teh page refreshes
  useEffect(()=> {
    
    // onSnapshot: every time a new post is added to the database, the code below will run.
    db.collection('posts').onSnapshot(snapshot => {
      // map: a function that loops through every doc, just like a for-loop
      // data: all the properties of the document. In this case- caption, username, imageUrl
      setPosts(snapshot.docs.map(doc => doc.data())); 
    })

  }, []);

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
        <h2>I am a modal</h2>
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
