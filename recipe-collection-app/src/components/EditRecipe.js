import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/AddRecipe.css';  // reuse styles

function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', steps: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:5174/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        const data = await response.json();
        setForm({
          name: data.Name || '',
          steps: (data.Steps || []).map(s => s.Instruction).join('\n')
        });
      } catch (error) {
        alert('Failed to load recipe: ' + error.message);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const stepsArray = form.steps
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => ({ Instruction: s }));  // PascalCase property

    const recipeToSend = {
      RecipeId: Number(id),  // PascalCase property
      Name: form.name,
      Steps: stepsArray
    };

    try {
      const response = await fetch(`http://localhost:5174/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeToSend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      alert('Recipe updated successfully!');
      navigate('/home');
    } catch (error) {
      alert(`Failed to update recipe: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="add-container">
      <form className="add-form" onSubmit={handleSubmit}>
        <h2>Edit Recipe</h2>
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

export default EditRecipe;
