import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import books from './books';
import Resource from './structures/Resource';
import Book from './structures/book';
import { parse } from 'yaml';

const getBook = async (location) => {
  const response = await fetch(location);
  const yaml = await response.text();
  return parse(yaml);
}

const library = books.map((url) => (new Resource(async () => new Book(await getBook(url)))));

ReactDOM.unstable_createRoot(
  document.getElementById('root')
).render(<App library={library}/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
