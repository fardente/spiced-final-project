import { useEffect, useState } from "react";
import axios from "axios";

export default function RecipeItemsForm({ recipe_items, editMode }) {
    const [items, setItems] = useState([]);
    const [edit, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [itemsAdded, setItemsAdded] = useState(false);

    useEffect(() => {
        setItems(recipe_items);
        const existing = Object.assign(
            {},
            ...recipe_items
                .filter(({ exists }) => !exists)
                .map((item) => {
                    return { [item.item_name]: item.id };
                })
        );
        setFormData(existing);
    }, [recipe_items]);

    useEffect(() => {
        setEditMode(editMode);
    }, [editMode]);

    function onChange(event) {
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

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const result = await axios.post("/api/recipes/buy", formData);
        console.log(result);
        setFormData({});
        setLoading(false);
        setItemsAdded(true);
    }

    return (
        <div className="box">
            <div className="container has-text-centered  ">
                <form
                    method="POST"
                    action="/api/recipes/buy"
                    onSubmit={(event) => handleSubmit(event)}
                >
                    <h2 className="subtitle has-text-weight-semibold has-text-centered">
                        Ingredients:
                    </h2>

                    <ul className="ingredients has-background-light">
                        {items.map((item) => (
                            <li key={item.id}>
                                <div className="field is-grouped has-text-left">
                                    <div className="control">
                                        <label className="checkbox p-3">
                                            <input
                                                type="checkbox"
                                                id={item.id}
                                                name={item.item_name}
                                                value={item.id}
                                                onChange={(event) =>
                                                    onChange(event)
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
            </div>
        </div>
    );
}
