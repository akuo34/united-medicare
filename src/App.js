import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import About from './About';
import Products from './Products';
import Contact from './Contact';
import Admin from './Admin';
// const Home = React.lazy(() => import('./Home'));
// const About = React.lazy(() => import('./About'));
// const Products = React.lazy(() => import('./Products'));
// const Contact = React.lazy(() => import('./Contact'));
// const Admin = React.lazy(() => import('./Admin'));

const App = () => {

  const [showToolbar, setShowToolbar] = useState(false);

  const toolbarHandler = () => {
    if (showToolbar) {
      setShowToolbar(false);
    } else {
      setShowToolbar(true);
    }
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
                <Link className="link" to="/">Home</Link>
                <Link className="link" to="/about">About</Link>
                <Link className="link" to="/products">Products</Link>
                <Link className="link" to="/contact">Contact</Link>
              </div>
              <img onClick={toolbarHandler} className="hamburger" src="/hamburger_button_white.svg" alt="hamburger button" />
            </div>
            <div className={showToolbar ? "container-links-small-device" : "container-links-small-device hidden"}>
              <Link onClick={toolbarHandler} className="link dropdown" to="/">Home</Link>
              <Link onClick={toolbarHandler} className="link dropdown" to="/about">About</Link>
              <Link onClick={toolbarHandler} className="link dropdown" to="/products">Products</Link>
              <Link onClick={toolbarHandler} className="link dropdown" to="/contact">Contact</Link>
            </div>
            <Switch>
              {/* <Route path="/admin" render={() => <Admin />} />
              <Route path="/contact" render={() => <Contact />} />
              <Route path="/products" render={() => <Products />} />
              <Route path="/about" render={() => <About />} />
              <Route exact path="/" render={() => <Home />} /> */}
              <Route path="/admin">
                <Admin />
              </Route>
              <Route path="/contact">
                <Contact />
              </Route>
              <Route path="/products">
                <Products />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </React.Suspense>
    </div>
  );
}

export default App;
