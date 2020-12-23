import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import GraphExplorer from './components/GraphExplorer';

import BookRoute from './routes/books';

function App({library}) {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/books">
            <BookRoute library={library} />
          </Route>
          <Route path="/graph">
            <GraphExplorer library={library} />
          </Route>
          <Route path="/">
            <div>The home page</div>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
