import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {

  const [ings, setIngs] = useState([]);

  const filteredIngsHandler = useCallback(filteredIngs => {
    setIngs(filteredIngs);
  }, [])

  useEffect(() => {
    console.log('Rendering', ings);
  }, [ings]);

  const addIngredientHandler = ing => {
    fetch('https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setIngs(prevIngs => [
        ...prevIngs,
        { id: responseData.name, ...ing }
      ]);
    });
  };

  const removeIngredientHandler = id => {
    fetch(`https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIngs(prevIngs => prevIngs.filter(item => item.id !== id))
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngs={filteredIngsHandler} />
        <IngredientList ingredients={ings} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
