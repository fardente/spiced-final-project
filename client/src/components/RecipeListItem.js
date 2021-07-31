import { Link } from "react-router-dom";

export default function RecipeListItem({ id, recipe_name }) {
    return (
        <div>
            <Link to={"/recipes/" + id}>{recipe_name}</Link>
        </div>
    );
}
