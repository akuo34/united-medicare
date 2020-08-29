import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import About from './About';
import Products from './Products';
import Contact from './Contact';
import Admin from './Admin';

const App = () => {

  const [showToolbar, setShowToolbar] = useState(false);

  const toolbarHandler = (products) => {
    if (products) {
      window.location = '/products';
    }
    if (showToolbar) {
      setShowToolbar(false);
    } else {
      setShowToolbar(true);
    }
  }

  const refreshProducts = () => {
    window.location = '/products';
  }

  return (
    <div className="App">
      <React.Suspense fallback={<span></span>}>
        <Router>
          <div className="container-page">
            <div className="toolbar-main">
              <div className="header-company">
                <Link className="link trademark" to="/">United Medi-Care Inc.</Link>
              </div>
              <div className="container-links">
                <Link className="link" to="/">About</Link>
                <Link className="link" onClick={refreshProducts} to='/products'>Products</Link>
                <Link className="link" to="/contact">Contact</Link>
              </div>
              <img onClick={() => toolbarHandler(false)} className="hamburger" src="/hamburger_button_white.svg" alt="hamburger button" />
            </div>
              <div className={showToolbar ? "container-links-small-device" : "container-links-small-device hidden"}>
                <Link onClick={() => toolbarHandler(false)} className="link dropdown" to="/">About</Link>
                <Link onClick={() => toolbarHandler(true)} className="link dropdown" to="/products">Products</Link>
                <Link onClick={() => toolbarHandler(false)} className="link dropdown" to="/contact">Contact</Link>
              </div>
              <div onClick={() => toolbarHandler(false)} className={showToolbar ? "clickable-bg" : "clickable-bg-hidden"}>
              </div>
            <div style={{"height":"10vh"}}></div>
            <Switch>
              <Route path="/admin">
                <Admin />
              </Route>
              <Route path="/contact">
                <Contact />
              </Route>
              <Route path="/products">
                <Products />
              </Route>
              <Route exact path="/">
                <About />
              </Route>
            </Switch>
          </div>
        </Router>
      </React.Suspense>
    </div>
  );
}

export default App;
