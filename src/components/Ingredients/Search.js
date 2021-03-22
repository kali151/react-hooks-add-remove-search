import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngs } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0
          ? ''
          : `?orderBy="title"&equalTo="${enteredFilter}"`
        fetch('https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngs = [];
            for (const key in responseData) {
              loadedIngs.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngs(loadedIngs)
          });
      }
    }, 500)
  }, [enteredFilter, onLoadIngs, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
