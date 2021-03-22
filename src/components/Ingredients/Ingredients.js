import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {

  const [ ings, setIngs] = useState([]);

  const filteredIngsHandler = useCallback(filteredIngs => {
    setIngs(filteredIngs);
  }, [])

  // useEffect(() => {
  //   fetch('https://react-hooks-ddd68-default-rtdb.firebaseio.com/ingredients.json')
  //   .then(response => response.json())
  //   .then(responseData => {
  //     const loadedIngs = [];
  //     for (const key in responseData) {
  //       loadedIngs.push({
  //         id: key,
  //         title: responseData[key].title,
  //         amount: responseData[key].amount
  //       });
  //     }
  //     setIngs(loadedIngs);
  //   });
  //   return () => {
  //     //cleanup
  //   }
  // }, []);

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
    setIngs(prevIngs => prevIngs.filter(item => item.id !== id))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngs={filteredIngsHandler}/>
        <IngredientList ingredients={ings} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
