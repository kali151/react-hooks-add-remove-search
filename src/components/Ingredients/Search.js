import React, {useState, useEffect} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngs } = props;
  const [enteredFilter, setEnteredFilter] = useState('');

  useEffect(() => {
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
  }, [enteredFilter, onLoadIngs]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
