// File: src/components/AddRecipe.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddRecipe.css';

function AddRecipe() {
  const [form, setForm] = useState({ name: '', steps: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Convert steps textarea (1 per line) into array
    const stepsArray = form.steps
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => ({ instruction: s }));

    const recipeToSend = {
      name: form.name,
      steps: stepsArray
      // Do not include 'procedure' unless backend expects it
    };

    try {
      const response = await fetch('http://localhost:5174/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      alert('Recipe added successfully!');
      navigate('/home');
    } catch (error) {
      alert(`Failed to add recipe: ${error.message}`);
    }
  };

  return (
    <div className="add-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <h2>Add Recipe</h2>
        <label>Recipe Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label>Steps (one per line)</label>
        <textarea
          name="steps"
          value={form.steps}
          onChange={handleChange}
          rows="5"
          placeholder="Enter one step per line"
          required
        />
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/home')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;
