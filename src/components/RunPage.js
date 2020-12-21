const RunPage = ({run, book, updateRun}) => {

  const next = Object.keys(run.next).map((page) => (<button key={page} onClick={() => {
    updateRun(run.goTo(page));
  }}>
    {run.next[page]} {page}
  </button>))

  return (
    <div>
      <h1>{book.title}</h1>
      <p>by {book.author}</p>
      <p>Published by {book.publisher}, {book.year}</p>
      <div>
        Current page: {run.page}
      </div>
      <div>
        {next}
      </div>
      <pre>
        {run.yaml}
      </pre>
    </div>
  );
}

export default RunPage;
