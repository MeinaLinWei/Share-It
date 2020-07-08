import React, {useState} from 'react';
import Post from './Post';
import Logo from "./0.jpeg";
import Cat from "./cat.jpg"
import './App.css';

function App() {
  const [posts, setPosts] = useState([
    {
      username:"Hypedinburgh",
      caption: "Social distancing each letters cause why not?",
      imageUrl: Logo
    },
    {
      username: "Lina", 
      caption: "Waaaaa cute kitties",
      imageUrl: Cat
    }
  ]);

  return (
    <div className="app">

      {/* Header */}
      <div className="app__header">
        <img 
          className="app__header__Image"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
      </div>

      {
        posts.map(post => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }

      <Post username="Hypedinburgh" caption="Social distancing each letters cause why not?" imageUrl={Logo}/>
      <Post username="Lina" caption="Waaaaa cute kitties" imageUrl={Cat}/>
      


    </div>
  );
}

export default App;
