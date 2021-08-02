import { Link } from "react-router-dom";
import useActive from "../hooks/useActive";

export default function Nav() {
    const [active, onClickActive] = useActive();

    return (
        <div className="navbar has-shadow">
            <div className={`navbar-burger ${active}`} onClick={onClickActive}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={`navbar-menu ${active}`} id="nav-links">
                <div className="navbar-end">
                    <Link className="navbar-item has-text-centered" to="/">
                        Shopping List
                    </Link>
                    <Link
                        className="navbar-item has-text-centered"
                        to="/recipes"
                    >
                        Recipes
                    </Link>
                    <Link
                        className="navbar-item has-text-centered"
                        to="/ingredients"
                    >
                        Ingredients
                    </Link>
                </div>
            </div>
        </div>
    );
}
