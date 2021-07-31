import RecipeListItem from "./RecipeListItem";
import { useState, useEffect } from "react";
import axios from "axios";

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);

    useEffect(async () => {
        const { data } = await axios.get("/api/recipes");
        setRecipes(data);
    }, []);

    return (
        <div>
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
