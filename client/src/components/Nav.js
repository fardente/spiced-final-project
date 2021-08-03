import { Link } from "react-router-dom";
import useActive from "../hooks/useActive";

export default function Nav() {
    const [active, onClickActive] = useActive();

    return (
        <div className="navbar has-shadow">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <span className="icon mx-3 has-background-warning-light has-text-danger-dark">
                        <ion-icon
                            name="pizza-sharp"
                            className="is-large"
                        ></ion-icon>
                    </span>
                    {"   "}Recipe Manager
                </div>
                {/* <input
                    className="navbar-item navbar-search is-active"
                    type="text"
                    name="searchTerm"
                    placeholder="search..."
                    // value={searchTerm}
                    // onChange={(event) => onSearch(event)}
                ></input> */}
                <div
                    className={`navbar-burger ${active}`}
                    onClick={() => onClickActive(!active)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className={`navbar-menu ${active}`} id="nav-links">
                <div className="navbar-end">
                    <Link
                        onClick={() => onClickActive(false)}
                        className="navbar-item has-text-centered"
                        to="/"
                    >
                        Shopping List
                    </Link>
                    <Link
                        onClick={() => onClickActive(false)}
                        className="navbar-item has-text-centered"
                        to="/recipes"
                    >
                        Recipes
                    </Link>
                    <Link
                        onClick={() => onClickActive(false)}
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
