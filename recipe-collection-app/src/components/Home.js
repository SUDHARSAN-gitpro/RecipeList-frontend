// Home.js
import '../styles/Home.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // Load recipes initially
  const loadRecipes = () => {
    fetch('http://localhost:5174/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(Array.isArray(data) ? data : []))
      .catch(err => alert('API error: ' + err));
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  // Delete handler
  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await fetch(`http://localhost:5174/api/recipes/${recipeId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        alert('Recipe deleted successfully!');
        loadRecipes();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }
  };

  // Edit handler - navigate to edit page with recipe id
  const handleEdit = (recipeId) => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  return (
    <div className="home-container">
      <header>
        <h2>Recipes</h2>
        <button className="add-btn" onClick={() => navigate('/add-recipe')}>
          Add Recipe
        </button>
      </header>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <div className="recipes-list">
          {recipes.map(recipe => (
            <div className="recipe-card" key={recipe.RecipeId}>
              <h3>{recipe.Name}</h3>
              {recipe.Steps && recipe.Steps.length > 0 ? (
                <ol>
                  {recipe.Steps.map((step, idx) => (
                    <li key={step.RecipeStepId || idx}>{step.Instruction}</li>
                  ))}
                </ol>
              ) : (
                <em>No steps added.</em>
              )}
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(recipe.RecipeId)}>Edit</button>{' '}
                <button onClick={() => handleDelete(recipe.RecipeId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
