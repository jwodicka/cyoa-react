import {stringify} from 'yaml';
import Book from './book';

class Run {
  constructor(book, page=undefined, history=[]) {
    this.book = book;
    this.page = page || book.start;
    this.history = history;
  }

  get current() {
    return this.book.getPage(this.page);
  }

  get next() {
    if (!this.current.next) {
      return {};
    }
    if (typeof this.current.next === 'number' || typeof this.current.next === 'string') {
      return {[this.current.next]: 'Continue'};
    }
    return this.current.next;
  }

  goTo(page) {
    // this.history.push(this.page);
    // this.page = page;
    return new Run(this.book, page, [...this.history, this.page]);
  }

  get yaml() {
    return stringify(this, function replacer(k, v) {
      if (v instanceof Book) {
        return v._data;
      }
      return v;
    }, {});
  }

}

export default Run;