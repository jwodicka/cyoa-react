import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import { useState, useEffect, Suspense } from 'react';

import { parse } from 'yaml';
import books from './books';
import Book from './structures/book';
import GraphExplorer from './components/GraphExplorer';
import RunPage from './components/RunPage';
import Resource from './structures/Resource';
import Run from './structures/Run';

const getBook = async (location) => {
  const response = await fetch(location);
  const yaml = await response.text();
  return parse(yaml);
}

function RunComp({book}) {
  const [run, updateRun] = useState();

  useEffect(function makeRun() {
    updateRun(new Run(book));
  }, [book])

  if (run == null) {
    return null;
  }

  return (<div>
    <RunPage book={book} run={run} updateRun={updateRun} />
  
    {/* {run.history.toString()}
    {JSON.stringify(run.current)} */}
  </div>)
}

function App() {
  const [library] = useState(
    books.map((url) => (new Resource(async () => new Book(await getBook(url)))))
  );

  useEffect(function loadLibrary() {
    library.forEach(l => l.load());
  }, [library]);

  const BookView = () => {
    const {id} = useParams();
    const book = library[id].read();
    return (
      <div>
        <RunComp book={book} />
      </div>
    );
  }

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
            <Switch>
              <Route path="/books/:id">
              <Suspense fallback={<h4>loading...</h4>}>
                <BookView />
              </Suspense>
              </Route>
              <Route path="/books">
                <h3>Some books:</h3>
                <Suspense fallback={<h4>loading...</h4>}>
                  <BookList library={library} />
                </Suspense>
              </Route>
            </Switch>
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

const BookList = ({ library }) => library.map((book, i) => (
  <BookSummary key={i} id={i} book={book.read()} />
));

const BookSummary = ({ id, book }) => (
  <div>
    <Link to={`/books/${id}`}>
      <span>{book.title}</span> by <span>{book.author}</span>, <span>{book.year}</span>
    </Link>
  </div>
)

export default App;
