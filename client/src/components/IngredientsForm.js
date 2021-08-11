import { useEffect, useState } from "react";
import axios from "axios";

export default function IngredientsForm({
    ingredients,
    setIngredients,
    editMode,
}) {
    const [currentIndex, setCurrentIndex] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [itemsAdded, setItemsAdded] = useState(false);

    useEffect(() => {
        const existing = Object.assign(
            {},
            ...ingredients
                .filter(({ exists }) => !exists)
                .map((item) => {
                    return { [item.item_name]: item.id };
                })
        );
        setFormData(existing);
    }, [ingredients]);

    useEffect(() => {
        if (searchTerm == "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        axios.get("/api/ingredients/search?q=" + searchTerm).then((result) => {
            setSearchResults(result.data);
        });
    }, [searchTerm]);

    const onChangeIngredients = (index) => (event) => {
        console.log("event", event, "idx", index);
        console.log("ingredients");
        let newIngrs = ingredients.map((ingr, idx) => {
            if (index !== idx) return ingr;
            return { ...ingr, item_name: event.target.value };
        });
        setIngredients(newIngrs);
        setSearchTerm(event.target.value);
        setCurrentIndex(index);
        setShowResults(true);
    };

    function onChangeCheckbox(event) {
        console.log("changevent", event.target.checked);
        if (event.target.checked) {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
        } else {
            const tempData = { ...formData };
            delete tempData[event.target.name];
            setFormData(tempData);
        }
        console.log(formData);
    }

    function onAdd(event) {
        event.preventDefault();
        setIngredients([...ingredients, { item_name: "" }]);
    }

    function onRemove(event, index) {
        event.preventDefault();
        const tempData = [...ingredients];
        setIngredients(tempData.filter((i, idx) => idx !== index));
    }

    function onClickResult(index, item_name) {
        console.log("click", event.target, item_name);
        let newIngrs = ingredients.map((ingr, idx) => {
            if (index !== idx) return ingr;
            return { ...ingr, item_name: item_name };
        });
        setIngredients(newIngrs);
        setSearchTerm("");
        // setCurrentIndex(index);
        setShowResults(false);
        console.log(ingredients);
    }

    function renderResults(index) {
        if (index == currentIndex) {
            return searchResults.map((item) => {
                return (
                    <div key={item.id} className="searchResult">
                        <div
                            onClick={() => onClickResult(index, item.item_name)}
                            className="itemInfo"
                        >
                            {item.item_name}
                        </div>
                    </div>
                );
            });
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const result = await axios.post("/api/recipes/buy", formData);
        console.log(result);
        setFormData({});
        setLoading(false);
        setItemsAdded(true);
    }

    function renderEdit() {
        return (
            <div className="field">
                {ingredients.map((item, index) => (
                    <div className="field has-addons" key={index.toString()}>
                        <div className="control">
                            <input
                                className="input"
                                value={item.item_name}
                                type="text"
                                placeholder="New ingredient..."
                                onChange={onChangeIngredients(index)}
                                // onBlur={() => {
                                //     console.log(
                                //         "Triggered because this input lost focus"
                                //     );
                                // }}
                            ></input>
                            {showResults && renderResults(index)}
                        </div>
                        <div className="control">
                            <a
                                name={index}
                                onClick={(event) => onRemove(event, index)}
                                className="button is-danger is-light"
                            >
                                {" "}
                                <span className="icon is-small is-left">
                                    <ion-icon name="close-outline"></ion-icon>
                                </span>
                            </a>
                        </div>
                    </div>
                ))}
                <div className="control">
                    <button
                        className="button is-success is-light is-outlined"
                        name="addIngredientBtn"
                        onClick={(event) => onAdd(event)}
                    >
                        Add
                    </button>
                </div>
            </div>
        );
    }

    function renderNormal() {
        return (
            <form
                method="POST"
                action="/api/recipes/buy"
                onSubmit={(event) => handleSubmit(event)}
            >
                <ul className="ingredients has-background-light">
                    {ingredients.map((item, index) => (
                        <li key={index.toString()}>
                            <div className="field is-grouped has-text-left">
                                <div className="control">
                                    <label className="checkbox p-3">
                                        <input
                                            type="checkbox"
                                            id={item.id}
                                            name={item.item_name}
                                            value={item.id}
                                            onChange={(event) =>
                                                onChangeCheckbox(event)
                                            }
                                            defaultChecked={!item.exists}
                                        ></input>
                                    </label>
                                    <label htmlFor={item.id}>
                                        {item.item_name}
                                    </label>
                                    {/* {edit && (
                                            <div className="control">
                                                <a className="button is-danger is-light">
                                                    {" "}
                                                    <span className="icon is-small is-left">
                                                        <ion-icon name="close-outline"></ion-icon>
                                                    </span>
                                                </a>
                                            </div>
                                        )}{" "} */}
                                    {item.exists ? "" : ""}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="field mt-3">
                    <div className="control">
                        <button className="button is-success" type="submit">
                            <span>Add to shopping list</span>

                            {itemsAdded ? (
                                <span className="icon is-small">
                                    <ion-icon name="checkmark-outline"></ion-icon>
                                </span>
                            ) : (
                                ""
                            )}
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <div className="box">
            <div className="container has-text-centered  ">
                <h2 className="subtitle has-text-weight-semibold has-text-centered">
                    Ingredients:
                </h2>
                {editMode ? renderEdit() : renderNormal()}{" "}
            </div>
        </div>
    );
}
