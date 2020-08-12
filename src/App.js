import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));
const Admin = React.lazy(() => import('./Admin'));
// const Events = React.lazy(() => import('./Events'));

const App = () => {
  return (
    <div className="App">
      <div className="toolbar-main">
        <React.Suspense fallback={<span></span>}>
          <Router>
            <ul>
              <li>
                <Link className="link" to="/">Home</Link>
              </li>
              <li>
                <Link className="link" to="/about">About</Link>
              </li>
            </ul>
            <Switch>
              <Route path="/about" render={() => <About />} />
              <Route path="/admin" render={() => <Admin />} />
              {/* <Route path="/products" render={() => <Products />} /> */}
              <Route exact path="/" render={() => <Home />} />
            </Switch>
          </Router>
        </React.Suspense>
      </div>
    </div>
  );
}

export default App;
