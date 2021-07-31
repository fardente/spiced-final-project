import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RecipeItemsForm from "./RecipeItemsForm";

export default function RecipeDetails() {
    const params = useParams();
    const [recipe, setRecipe] = useState([]);
    const [recipeItems, setRecipeItems] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(async () => {
        const id = params.id;
        let { data } = await axios.get("/api/recipes/" + id);
        if (data.length < 1) {
            console.log("no recipes");
            return;
        }
        setRecipe(data[0]);

        ({ data } = await axios.get("/api/recipes/" + id + "/items"));
        if (data.length < 1) {
            console.log("no recipe items");
            return;
        }
        setRecipeItems(data);
        console.log(data);
    }, []);

    async function toggleEditMode() {
        if (editMode) {
            try {
                await axios.put("/api/recipes", { ...recipe });
            } catch (error) {
                console.error("error updating recipe", error);
            }
        }
        setEditMode(!editMode);
    }

    const editRender = <input type="text" placeholder="Name.."></input>;
    // const ingredientsRender =

    return (
        <div>
            {editRender}
            RecipeDetails{" "}
            <button onClick={toggleEditMode}>
                {editMode ? "Save" : "Edit"}
            </button>
            {recipe.recipe_name}
            <RecipeItemsForm recipe_items={recipeItems} editMode={editMode} />
            {editMode ? (
                <textarea
                    onChange={(event) =>
                        setRecipe({
                            ...recipe,
                            recipe_preparation: event.target.value,
                        })
                    }
                    defaultValue={recipe.recipe_preparation}
                ></textarea>
            ) : (
                <code>{recipe.recipe_preparation}</code>
            )}
        </div>
    );
}
