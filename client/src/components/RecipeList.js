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

    return (
        <div>
            <Link to="/recipes/add">
                <button>Add Recipe</button>
            </Link>
            <input
                type="text"
                name="searchTerm"
                value={searchTerm}
                onChange={(event) => onSearch(event)}
            ></input>
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
