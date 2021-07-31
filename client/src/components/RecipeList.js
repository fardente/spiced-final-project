import RecipeListItem from "./RecipeListItem";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);

    useEffect(async () => {
        const { data } = await axios.get("/api/recipes");
        setRecipes(data);
    }, []);

    return (
        <div>
            <Link to="/recipes/add">
                <button>Add Recipe</button>
            </Link>

            <div>
                {recipes.map((recipe) => (
                    <RecipeListItem
                        key={recipe.id}
                        id={recipe.id}
                        recipe_name={recipe.recipe_name}
                        recipe_preparation={recipe.recipe_preparation}
                    />
                ))}
            </div>
        </div>
    );
}
