import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import RecipeItemsForm from "./RecipeItemsForm";
import IngredientsForm from "./IngredientsForm";
// import Markdown from "./Markdown";

export default function RecipeDetails() {
    const params = useParams();
    const [recipe, setRecipe] = useState({});
    const [ingredients, setIngredients] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const history = useHistory();
    // const [isActive, setIsActive] = useState(false);

    useEffect(async () => {
        const id = params.id;
        let { data } = await axios.get("/api/recipes/" + id);
        if (data.length < 1) {
            console.log("no recipes");
            return;
        }
        console.log("received recipe", data[0]);
        setRecipe(data[0]);

        ({ data } = await axios.get("/api/recipes/" + id + "/items"));
        if (data.length < 1) {
            console.log("no recipe items");
            return;
        }
        console.log("Data", data);
        setIngredients(data);
        console.log(data);
    }, []);

    async function toggleEditMode() {
        if (editMode) {
            try {
                await axios.put("/api/recipes", { ...recipe, ingredients });
                console.log("ings to send", ingredients);
            } catch (error) {
                console.error("error updating recipe", error);
            }
        }
        setEditMode(!editMode);
    }

    function onChange(event) {
        setRecipe({
            ...recipe,
            [event.target.name]: event.target.value,
        });
    }

    async function changeImage(event) {
        console.log("new image", event.target.files[0]);
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        try {
            const response = await axios.put(
                "/api/recipes/" + params.id + "/image",
                formData
            );
            console.log(response);
            setRecipe({
                ...recipe,
                image_url: response.data,
            });
        } catch (error) {
            console.log("error changing image");
        }
    }

    async function deleteRecipe() {
        if (!confirm("Delete recipe " + recipe.recipe_name + "?")) {
            return;
        }
        try {
            await axios.post("/api/recipes/delete", { id: params.id });
            history.push("/recipes");
        } catch (error) {
            console.error("error deleting recipe", error);
        }
    }

    // function onImageClick(event) {
    //     setIsActive(!isActive);
    // }

    const editRender = (
        <input
            className="input is-info"
            type="text"
            name="recipe_name"
            onChange={(event) => onChange(event)}
            value={recipe.recipe_name}
        ></input>
    );
    // const ingredientsRender =

    return (
        <div className="container has-text-centered">
            <section
                className="hero is-medium is-info is-relative"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(" +
                        recipe.image_url +
                        ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    paddingBottom: "20px",
                }}
            >
                <div className="hero-body">
                    <p className="title">
                        {editMode ? editRender : recipe.recipe_name}
                    </p>
                    <div className="field is-grouped is-grouped-right edit-recipe-div">
                        <div className="recipe-file-button">
                            <div className="file">
                                <label className="file-label">
                                    <input
                                        className="file-input"
                                        type="file"
                                        name="newRecipeImage"
                                        onChange={(event) => changeImage(event)}
                                    />
                                    <span className="icon is-large">
                                        <ion-icon name="camera-outline"></ion-icon>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            className="recipe-button"
                            onClick={toggleEditMode}
                        >
                            {editMode ? (
                                <span className="icon is-large">
                                    <ion-icon name="save-outline"></ion-icon>
                                </span>
                            ) : (
                                <span className="icon is-large">
                                    <ion-icon name="create-outline"></ion-icon>
                                </span>
                            )}
                        </button>
                        {editMode && (
                            <button
                                className="recipe-button"
                                onClick={deleteRecipe}
                            >
                                <span className="icon is-large">
                                    <ion-icon name="trash-outline"></ion-icon>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <div className="container mt-5">
                {/* <img src={recipe.image_url} onClick={onImageClick}></img> */}
                <div className="columns">
                    <div className="column is-one-third">
                        {/* <RecipeItemsForm
                            recipe_items={recipeItems}
                            editMode={editMode}
                        /> */}
                        <IngredientsForm
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            editMode={editMode}
                        />
                    </div>
                    <div className="column is-two-thirds">
                        {editMode ? (
                            <textarea
                                className="textarea is-info"
                                rows="15"
                                name="recipe_preparation"
                                onChange={(event) => onChange(event)}
                                defaultValue={recipe.recipe_preparation}
                            ></textarea>
                        ) : (
                            <div className="box">
                                <div className="content preparation has-text-left">
                                    {recipe.recipe_preparation}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* <div className="column">
                        <div className="field is-grouped is-grouped-right">
                            <div className="control">
                                <button
                                    className="button is-info"
                                    onClick={toggleEditMode}
                                >
                                    {editMode ? "Save" : "Edit"}
                                </button>
                            </div>
                            <div className="control">
                                <button
                                    className="button is-danger"
                                    onClick={deleteRecipe}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* <Markdown></Markdown> */}
                {/* <div
                    onClick={onImageClick}
                    className={`modal ${isActive ? "is-active" : ""} `}
                >
                    <div className="modal-background"></div>
                    <div className="modal-content"></div>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                    ></button>
                </div> */}
            </div>
        </div>
    );
}
