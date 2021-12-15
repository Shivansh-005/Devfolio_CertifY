import React, { Component } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import FileCertificatorPage from './components/FileCertificatorPage/FileCertificatorPage'
import NavBar from './components/NavBar/NavBar'
import FaqPage from './components/FaqPage/FaqPage'
import AboutPage from './components/AboutPage/AboutPage'

import AuthenticityContract from "./contracts/Authenticity.json";

import getWeb3 from "./utils/getWeb3";
import CryptoJS from "crypto-js";

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import "./App.css";

class App extends Component {


  render() {

    return (
      <div className="App">
      <NavBar />
      <Router>
      <Route exact path="/" component={FileCertificatorPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/about" component={AboutPage} />

      </Router>
      <footer>
        <p className={"footerText"}>© 2021 TIET | Made by Capstont Team 9</p>
    </footer>
      </div>
    );
  }
}

export default App;
