import { Suspense, useState, useEffect } from 'react';
import { Link, Switch, Route, useParams } from "react-router-dom";

import RunPage from '../components/RunPage';
import Run from '../structures/Run';

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

const BookView = ({library}) => {
  const {id} = useParams();
  const book = library[id].read();
  return (
    <div>
      <RunComp book={book} />
    </div>
  );
}

const BookRoute = ({library}) => (
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
)

export default BookRoute