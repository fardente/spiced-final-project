import { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import StatusMessage from "./StatusMessage";
import axios from "axios";
import IngredientsForm from "./IngredientsForm";

export default function RecipeForm() {
    const [recipe, setRecipe] = useState({
        recipe_name: "",
        recipe_preparation: "",
    });
    const [ingredients, setIngredients] = useState([{ name: "" }]);
    const [errorMessage, setErrorMessage] = useState("");
    // const [searchTerm, setSearchTerm] = useState("");
    // const [searchResults, setSearchResults] = useState([]);
    // const [currentIndex, setCurrentIndex] = useState("");
    // const [showResults, setShowResults] = useState(false);
    // const [edit, setEditMode] = useState(true);
    const edit = true;
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const file = useRef();

    function onChange(event) {
        setRecipe({
            ...recipe,
            [event.target.name]: event.target.value,
        });
        console.log(ingredients);
    }

    async function onSubmit(event) {
        event.preventDefault();
        if (recipe.recipe_name == "") {
            setErrorMessage({ error: "Recipe name can't be empty!" });
            return;
        }
        setLoading(true);
        // {
        //         ingredients: ingredients.filter((x) => x != ""),
        //         ...recipe,
        //         file: file.current.files[0],
        //     }
        const filtered = ingredients.filter((x) => x != "");
        // console.log("filter", filtered);
        const filterjson = JSON.stringify(filtered);
        var formData = new FormData();
        formData.append("ingredients", filterjson);
        formData.append("recipe_name", recipe.recipe_name);
        formData.append("recipe_preparation", recipe.recipe_preparation);
        formData.append("file", file.current.files[0]);
        try {
            const response = await axios.post("/api/recipes/add", formData);
            console.log(response);
        } catch (error) {
            setErrorMessage({ error: error.response.data.error });
        }
        setLoading(false);
        setRecipe({ recipe_name: "", recipe_preparation: "" });
        setIngredients([{ name: "" }]);
        // setShowResults(false);
        history.push("/recipes");
    }

    return (
        <div className="container">
            <div className="columns is-centered">
                <div className="column  is-half">
                    <form
                        action="/"
                        method="POST"
                        encType="multipart/form-data"
                        onSubmit={(event) => onSubmit(event)}
                    >
                        <h2 className="title has-text-centered">
                            Add a Recipe
                        </h2>
                        <div className="field">
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="recipe_name"
                                    placeholder="Recipe Name"
                                    onChange={(event) => onChange(event)}
                                    value={recipe.recipe_name}
                                    required
                                ></input>
                            </div>
                        </div>
                        <IngredientsForm
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            editMode={edit}
                        />

                        <div className="field">
                            <div className="control">
                                <textarea
                                    className="textarea is-info"
                                    value={recipe.recipe_preparation}
                                    name="recipe_preparation"
                                    onChange={(event) => onChange(event)}
                                    placeholder="Add preparation steps here..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Add an image:</label>
                            <div className="file is-info is-small">
                                <label className="file-label">
                                    <input
                                        className="file-input"
                                        type="file"
                                        accept="image/*"
                                        name="file"
                                        id="file"
                                        ref={file}
                                    ></input>
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <ion-icon name="cloud-upload-outline"></ion-icon>
                                        </span>
                                        <span className="file-label">
                                            Choose a file…
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="field is-grouped is-grouped-right">
                            <div className="control">
                                <button
                                    className={`button is-success ${
                                        loading ? "is-loading" : ""
                                    }`}
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                            <div className="control">
                                <Link className="button" to="/recipes">
                                    Cancel
                                </Link>
                            </div>
                        </div>

                        {/*
<div className="file">
  <label className="file-label">
    <input className="file-input" type="file" name="resume">
    <span className="file-cta">
      <span className="file-icon">
        <i className="fas fa-upload"></i>
      </span>
      <span className="file-label">
        Choose a file…
      </span>
    </span>
  </label>
</div>
*/}
                    </form>
                </div>
            </div>
            <StatusMessage message={errorMessage} />
        </div>
    );
}
