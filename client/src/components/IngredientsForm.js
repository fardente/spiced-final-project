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
        // console.log("event", event, "idx", index);
        let newIngrs = ingredients.map((ingr, idx) => {
            if (index !== idx) return ingr;
            return { ...ingr, name: event.target.value };
        });
        setIngredients(newIngrs);
        setSearchTerm(event.target.value);
        setCurrentIndex(index);
        setShowResults(true);
    };

    function onAdd(event) {
        event.preventDefault();
        setIngredients([...ingredients, { name: "" }]);
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
            return { ...ingr, name: item_name };
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

    function renderEdit() {
        return (
            <div className="field">
                <label className="label">Ingredients:</label>
                {ingredients.map((item, index) => (
                    <div className="field has-addons" key={index.toString()}>
                        <div className="control">
                            <input
                                className="input"
                                value={item.name}
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

    return <div>{editMode && renderEdit()}</div>;
}
