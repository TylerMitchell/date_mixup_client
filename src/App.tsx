import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import IconBar from "./sections/IconBar";

import Splash from "./pages/Splash";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import DatePage from "./pages/Date";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Contacts from "./pages/Contacts";
import Account from "./pages/Account";
import Messager from "./pages/Messager";

import Footer from "./sections/Footer";

import URLS from "./helpers/environment";
type Props = { 

};

type State = { 
  isLoggedIn: Boolean,
  user: DB_User | null,
  profile: DB_Profile | null
};

export type User = {
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  isOrganizer?: boolean,
  screenName?: string
};

export type DB_Fields = {
  id?: number,
  createdAt?: Date,
  updatedAt?: Date
}

export type Basic_Profile = {
  screenName: string,
  age?: number,
  gender?: string,
  bio?: string,
  userId?: number
}

export type DB_User = User & DB_Fields;
export type DB_Profile = Basic_Profile & DB_Fields;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = { 
      isLoggedIn: false,
      user: null,
      profile: null
    };
  }

  getProfileData = (id: number | null = null): void => {
    //this kind of stuff makes me hate typescript.
    //You can't do this fetch unless all this stuff is defined
    //raw js looks like this: id = id ? id : this.state.user.id;
    id = (id) ? id : 
      (this.state.user && this.state.user.id) ? this.state.user.id : null;

    if(id){
      fetch(URLS.APIURL + "/profile", {
        method: "GET",
        headers: new Headers({
            "content-Type": "application/json",
            "Authorization": window.localStorage.getItem("sessionToken") as string
        })
      })
      .then( (res) => res.json() )
      .then( (json) => {
        console.log(json.profile);
        this.setState({ profile: json.profile as DB_Profile });
      })
      .catch( (err) => { console.log( "Error: ", err ); } );
    } else{ alert("Id was never assigned or passed in by caller."); }
  }

  updateProfileData = (profile: DB_Profile): void => {
    fetch(URLS.APIURL + "/profile", {
      method: "PUT",
      body: JSON.stringify({ profile: profile }),
      headers: new Headers({
          "content-Type": "application/json",
          "Authorization": window.localStorage.getItem("sessionToken") as string
      })
    })
    .then( (res) => res.json() )
    .then( (json) => {
      console.log("updated: ", json);
      this.setState({ profile: profile });
    })
    .catch( (err) => { console.log( "Error: ", err ); } );
  }

  loginToApp = (user: User) => {
    console.log("Login Function Hit!");

    fetch(URLS.APIURL + "/user/login", {
      method: "POST",
      body: JSON.stringify({ user: user }),
      headers: new Headers({
          "content-Type": "application/json"
      })
    }).then( (res) => res.json() )
    .then( (json) => {
      window.localStorage.setItem( "sessionToken", json.sessionToken );

      let tUser = json.user;
      delete tUser.passwordhash;
      tUser.createdAt = new Date(tUser.createdAt);
      tUser.updatedAt = new Date(tUser.updatedAt);

      fetch(URLS.APIURL + "/profile", {
        method: "GET",
        headers: new Headers({
            "content-Type": "application/json",
            "Authorization": json.sessionToken
        })
      })
      .then( (res) => res.json() )
      .then( (json) => {
        console.log(json.profile);
        this.setState({ profile: json.profile as DB_Profile, isLoggedIn: true });
      })
      .catch( (err) => { console.log( "Error: ", err ); } );

      this.setState({ user: tUser as DB_User });
    })
    .catch( (err) => { console.log( "Error: ", err ); } );
  }
  logoutOfApp = () => {
    this.setState({ isLoggedIn: false });
    window.localStorage.setItem("sessionToken", "");
  }

  registerToApp = (user: User, profile: Basic_Profile) => {
    console.log("Register Function Hit!");

    fetch(URLS.APIURL + "/user/register", {
      method: "POST",
      body: JSON.stringify({ user: user, profile: profile }),
      headers: new Headers({
          "content-Type": "application/json"
      })
    }).then( (res) => { return res.json(); } )
    .then( (json) => {
      if(json.errors){ alert( json.errors[0].message ); }
      else{
        alert( json.message );
      }
    }).catch( (err) => { console.log( "Error: ", err ); } );
  }

  render() {
    return (
      <div className="App">
        <Router >
          { this.state.isLoggedIn ? <><IconBar /><br /></> : <></> }
          <Switch>
            <Route path="/about" ><About /></Route>
            <Route path="/contactus" ><ContactUs /></Route>
            <Route path="/privacypolicy" ><PrivacyPolicy /></Route>
            { this.state.isLoggedIn ?
            <>
              <Route path="/profile" >
                <Profile 
                profileData={this.state.profile} 
                getProfileFunc={this.getProfileData} 
                putProfileFunc={this.updateProfileData}
                userData={this.state.user}
                />
              </Route>
              <Route path="/events" ><Events /></Route>
              <Route path="/contacts" ><Contacts /></Route>
              <Route path="/date"><DatePage /></Route>
              <Route path="/account"><Account userData={this.state.user} logoutFunc={this.logoutOfApp}/></Route>
              <Route path="/messager"><Messager /></Route>
              <Route exact path="/"><DatePage /></Route>
            </> : <Route path="/"><Splash loginFunc={this.loginToApp} registerFunc={this.registerToApp} /></Route> }
          </Switch>
          <br />
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
