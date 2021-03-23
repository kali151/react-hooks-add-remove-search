import React, { useState, useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIng, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIng, action.ingredient]
    case 'DELETE':
      return currentIng.filter(ing => ing.id !== action.id)
    default:
      throw new Error('No')
  }
}

const Ingredients = () => {
  const [ings, dispatch] = useReducer(ingredientReducer, []);

  //const [ings, setIngs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('Rendering', ings);
  }, [ings]);

  const filteredIngsHandler = useCallback(filteredIngs => {
    //setIngs(filteredIngs);
    dispatch({
      type: 'SET',
      ingredients: filteredIngs
    })
  }, [])

  const addIngredientHandler = ing => {
    setIsLoading(true);
    fetch('https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      dispatch({
        type: 'ADD',
        ingredient: { id: responseData.name, ...ing }
      })
      // setIngs(prevIngs => [
      //   ...prevIngs,
      //   { id: responseData.name, ...ing }
      // ]);
    });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);
    fetch(`https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      dispatch({
        type: 'DELETE',
        id: id
      })
      // setIngs(prevIngs => prevIngs.filter(item => item.id !== id))
    }).catch(error => {
      setError("Smth went wrong!: ", error.message);
      setIsLoading(false);
    })
  }

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngs={filteredIngsHandler} />
        <IngredientList ingredients={ings} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
