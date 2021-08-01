import { useState, useEffect } from "react";
import axios from "axios";

export default function RecipeForm() {
    // const form = useRef(null);
    const [recipe, setRecipe] = useState({
        recipe_name: "",
        recipe_preparation: "",
    });
    const [ingredients, setIngredients] = useState({ 0: "" });
    const [errorMessage, setErrorMessage] = useState("");

    function onChange(event) {
        setRecipe({
            ...recipe,
            [event.target.name]: event.target.value,
        });
    }
    function onChangeIngredients(event) {
        setIngredients({
            ...ingredients,
            [event.target.name]: event.target.value,
        });
    }

    function onAdd(event) {
        event.preventDefault();
        setIngredients({
            ...ingredients,
            [Object.values(ingredients).length]: "",
        });
    }

    function onRemove(event) {
        event.preventDefault();
        const tempData = { ...ingredients };
        delete tempData[event.target.name];
        setIngredients(tempData);
    }

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await axios.post("/api/recipes/add", {
                ingredients: Object.values(ingredients).filter((x) => x != ""),
                ...recipe,
            });
            console.log(response);
        } catch (error) {
            setErrorMessage(error.response.data.error);
        }
        setRecipe({ recipe_name: "", recipe_preparation: "" });
        setIngredients({ 0: "" });
    }

    return (
        <div>
            <h2>Add a recipe</h2>
            <form onSubmit={(event) => onSubmit(event)}>
                <div>
                    <input
                        type="text"
                        name="recipe_name"
                        placeholder="Recipe Name"
                        onChange={(event) => onChange(event)}
                        value={recipe.recipe_name}
                    ></input>
                </div>
                <div>
                    Zutaten:
                    {Object.values(ingredients).map((item, index) => (
                        <div key={item.name + index.toString()}>
                            <input
                                value={ingredients[index]}
                                type="text"
                                name={index}
                                placeholder="New Ingredient..."
                                onChange={(event) => onChangeIngredients(event)}
                            ></input>
                            <button
                                name={index}
                                onClick={(event) => onRemove(event)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        name="addIngredientBtn"
                        onClick={(event) => onAdd(event)}
                    >
                        Add
                    </button>
                </div>
                <div>
                    <textarea
                        value={recipe.recipe_preparation}
                        name="recipe_preparation"
                        onChange={(event) => onChange(event)}
                        placeholder="Add preparation steps here..."
                    ></textarea>
                    <button type="submit">submit</button>
                </div>
                <button type="reset">reset</button>
            </form>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}
