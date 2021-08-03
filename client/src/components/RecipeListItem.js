import { Link } from "react-router-dom";

export default function RecipeListItem({
    id,
    recipe_name,
    recipe_preparation,
    image_url,
}) {
    return (
        <div className="column is-3">
            <div className="card">
                <div className="card-image">
                    <figure className="image">
                        <Link to={"/recipes/" + id}>
                            {" "}
                            <img
                                src={
                                    image_url ||
                                    "https://bulma.io/images/placeholders/1280x960.png"
                                }
                                alt="Placeholder image"
                            />
                        </Link>{" "}
                    </figure>
                </div>

                <div className="card-content">
                    <div className="media">
                        {/* <div className="media-left"></div> */}
                        <div className="media-content">
                            <p className="title is-4">
                                {" "}
                                <Link to={"/recipes/" + id}>{recipe_name}</Link>
                            </p>
                            {/* <p className="subtitle is-6">@johnsmith</p> */}
                        </div>
                    </div>
                    <div className="content">
                        {recipe_preparation.slice(0, 75)}...
                        <br />
                        {/* <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
