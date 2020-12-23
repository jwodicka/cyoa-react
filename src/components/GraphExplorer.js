import { Suspense, useState } from 'react';

import BookGraph from './BookGraph';

const BookSelector = ({ library, book, updateBook }) => (
  <select id='books' value={book} onChange={(e) => updateBook(e.target.value)}>
    {library.map((record, i) => {
      const book = record.read();
      return (<option key={book.title} value={i}>{book.title}</option>);
    })}
  </select>
)

const GraphExplorer = ({ library }) => {
  const [layout, updateLayout] = useState('cola');
  const [book, updateBook] = useState();

  console.log("library", library);

  return (
    <div>
      <div id="chart">
        {book ? (<BookGraph book={library[book].read()} layout={layout} />) : null}
      </div>
      <select value={layout} onChange={(e) => updateLayout(e.target.value)}>
        <option value='grid'>Grid</option>
        <option value='cola'>CoLa</option>
        <option value='fcose'>fCose</option>
        <option value='avsdf'>AVSDF</option>
        <option value='dagre'>DAGRE</option>
        <option value='klay'>Klay</option>
      </select>
      <Suspense fallback={<h4>loading...</h4>}>
        <BookSelector library={library} book={book} updateBook={updateBook} />
      </Suspense>
    </div>
  )
}

export default GraphExplorer;