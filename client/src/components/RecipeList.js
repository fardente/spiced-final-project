import RecipeListItem from "./RecipeListItem";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [tempItems, setTempItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(async () => {
        const { data } = await axios.get("/api/recipes");
        setRecipes(data);
        setTempItems(data);
    }, []);

    useEffect(() => {
        const res = tempItems.filter(
            (x) =>
                x.recipe_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
                -1
        );
        setRecipes(res);
    }, [searchTerm]);

    function onSearch(event) {
        setSearchTerm(event.target.value);
    }

    /*
      <div class='container has-text-centered'>
    <div class='columns is-mobile is-centered'>
      < class='column is-5'>
    */

    return (
        <div className="container has-text-centered mb-6">
            <h2 className="title">Recipe List</h2>
            <div className="control m-4">
                <Link className="button is-success" to="/recipes/add">
                    <span className="icon is-large">
                        <ion-icon
                            name="add-outline"
                            className="is-large"
                        ></ion-icon>
                    </span>
                    <span>Add Recipe</span>
                </Link>
            </div>
            <div className="container searchbox mb-5">
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        name="searchTerm"
                        id="searchInput"
                        placeholder="Filter list..."
                        value={searchTerm}
                        onChange={(event) => onSearch(event)}
                    ></input>{" "}
                    <span className="icon is-small is-left">
                        <ion-icon name="search-outline"></ion-icon>
                    </span>
                </div>
                <div className="control">
                    <a
                        className="button"
                        onClick={() => {
                            setSearchTerm("");
                        }}
                    >
                        <span className="icon is-small is-left">
                            <ion-icon name="close-outline"></ion-icon>
                        </span>
                    </a>
                </div>
            </div>

            <div className="columns is-multiline">
                {recipes.map((recipe) => (
                    <RecipeListItem
                        key={recipe.id}
                        id={recipe.id}
                        recipe_name={recipe.recipe_name}
                        recipe_preparation={recipe.recipe_preparation}
                        image_url={recipe.image_url}
                    />
                ))}
            </div>
        </div>
    );
}
