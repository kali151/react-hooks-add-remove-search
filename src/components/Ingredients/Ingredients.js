import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useCoco from '../../hooks/http';

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
};

const Ingredients = () => {
  const [ings, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clear
  } = useCoco();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra }
      });
    }
    // console.log('Rendering ingrs', data);
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngsHandler = useCallback(filteredIngs => {
    //setIngs(filteredIngs);
    dispatch({
      type: 'SET',
      ingredients: filteredIngs
    });
  }, []);

  const addIngredientHandler = useCallback(ing => {
    sendRequest(
      'https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ing),
      ing,
      'ADD_INGREDIENT'
    );
    // dispatchHttp({ type: 'SEND' });
    // // setIsLoading(true);
    // fetch('https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ing),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(response => {
    //   dispatchHttp({ type: 'RESPONSE' });
    //   // setIsLoading(false);
    //   return response.json();
    // }).then(responseData => {
    //   dispatch({
    //     type: 'ADD',
    //     ingredient: { id: responseData.name, ...ing }
    //   })
    //   // setIngs(prevIngs => [
    //   //   ...prevIngs,
    //   //   { id: responseData.name, ...ing }
    //   // ]);
    // });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(
      `https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      'REMOVE_INGREDIENT');
    //dispatchHttp({ type: 'SEND' });
    //setIsLoading(true);

  }, [sendRequest]);

  // const clearError = useCallback(() => {
  //   sendRequest({ type: 'CLEAR_ERROR' })
  //   //setError(null);
  // }, [sendRequest]);

  const ingrList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ings}
        onRemoveItem={removeIngredientHandler} />
    );
  }, [ings, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngs={filteredIngsHandler} />
        {ingrList}
      </section>
    </div>
  );
}

export default Ingredients;
