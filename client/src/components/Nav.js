import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <div>
            Nav
            <Link to="/">Shopping List</Link>
            <Link to="/recipes">Recipes</Link>
            <Link to="/ingredients">Ingredients</Link>
        </div>
    );
}
