import { useState, useEffect } from "react";
import StatusMessage from "./StatusMessage";
import axios from "axios";

export default function RecipeForm() {
    const [recipe, setRecipe] = useState({
        recipe_name: "",
        recipe_preparation: "",
    });
    const [ingredients, setIngredients] = useState([{ name: "" }]);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState("");

    useEffect(() => {
        if (searchTerm == "") {
            setSearchResults([]);
            return;
        }
        console.log("searching...", searchTerm);
        axios.get("/api/ingredients/search?q=" + searchTerm).then((result) => {
            setSearchResults(result.data);
        });
    }, [searchTerm]);

    function onChange(event) {
        setRecipe({
            ...recipe,
            [event.target.name]: event.target.value,
        });
        console.log(ingredients);
    }
    const onChangeIngredients = (index) => (event) => {
        console.log("event", event, "idx", index);
        let newIngrs = ingredients.map((ingr, idx) => {
            if (index !== idx) return ingr;
            return { ...ingr, name: event.target.value };
        });
        setIngredients(newIngrs);
        setSearchTerm(event.target.value);
        setCurrentIndex(index);
    };

    function onAdd(event) {
        event.preventDefault();
        setIngredients([...ingredients, { name: "" }]);
    }

    function onRemove(event, index) {
        event.preventDefault();
        const tempData = [...ingredients];
        setIngredients(tempData.filter((i, idx) => idx !== index));
    }

    async function onSubmit(event) {
        event.preventDefault();
        if (recipe.recipe_name == "") {
            setErrorMessage({ error: "Recipe name can't be empty!" });
            return;
        }
        try {
            const response = await axios.post("/api/recipes/add", {
                ingredients: ingredients.filter((x) => x != ""),
                ...recipe,
            });
            console.log(response);
        } catch (error) {
            setErrorMessage({ error: error.response.data.error });
        }
        setRecipe({ recipe_name: "", recipe_preparation: "" });
        setIngredients([{ name: "" }]);
    }

    function renderResults(index) {
        if (index == currentIndex) {
            return searchResults.map((item) => {
                return (
                    <div key={item.id} className="searchResult">
                        <div className="itemInfo">{item.item_name}</div>
                    </div>
                );
            });
        }
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
                        required
                    ></input>
                </div>
                <div>
                    Zutaten:
                    {ingredients.map((item, index) => (
                        <div key={index.toString()}>
                            <input
                                value={item.name}
                                type="text"
                                placeholder="New ingredient..."
                                onChange={onChangeIngredients(index)}
                            ></input>
                            {renderResults(index)}
                            <button
                                name={index}
                                onClick={(event) => onRemove(event, index)}
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
            <StatusMessage message={errorMessage} />
        </div>
    );
}
