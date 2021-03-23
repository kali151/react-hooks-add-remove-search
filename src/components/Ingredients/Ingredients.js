import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return {
        ...httpState, loading: false
      }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR_ERROR':
      return { ...httpState, error: null }
    default:
      throw new Error('No')
  }
}

const Ingredients = () => {
  const [ings, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null })

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

  const addIngredientHandler = useCallback(ing => {
    dispatchHttp({ type: 'SEND' });
    // setIsLoading(true);
    fetch('https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ing),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      // setIsLoading(false);
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
  }, []);

  const removeIngredientHandler = useCallback(id => {
    dispatchHttp({ type: 'SEND' });
    //setIsLoading(true);
    fetch(`https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
      //setIsLoading(false);
      dispatch({
        type: 'DELETE',
        id: id
      })
      // setIngs(prevIngs => prevIngs.filter(item => item.id !== id))
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message });
      // setError("Smth went wrong!: ", error.message);
      // setIsLoading(false);
    })
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR_ERROR' })
    //setError(null);
  }, []);

  const ingrList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ings}
        onRemoveItem={removeIngredientHandler} />
    );
  }, [ings, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading} />

      <section>
        <Search onLoadIngs={filteredIngsHandler} />
        {ingrList}
      </section>
    </div>
  );
}

export default Ingredients;
