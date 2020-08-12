import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));
const Products = React.lazy(() => import('./Products'));
const Contact = React.lazy(() => import('./Contact'));
const Admin = React.lazy(() => import('./Admin'));

const App = () => {
  return (
    <div className="App">
      <React.Suspense fallback={<span></span>}>
        <Router>
          <div className="toolbar-main">
            <div className="header-company">
              <Link className="link" to="/">United Medicare</Link>
            </div>
            <div className="container-links">
              <Link className="link" to="/">Home</Link>
              <Link className="link" to="/about">About</Link>
              <Link className="link" to="/products">Products</Link>
              <Link className="link" to="/contact">Contact</Link>
            </div>
          </div>
          <Switch>
            <Route path="/admin" render={() => <Admin />} />
            <Route path="/contact" render={() => <Contact />} />
            <Route path="/products" render={() => <Products />} />
            <Route path="/about" render={() => <About />} />
            <Route exact path="/" render={() => <Home />} />
          </Switch>
        </Router>
      </React.Suspense>
    </div>
  );
}

export default App;
