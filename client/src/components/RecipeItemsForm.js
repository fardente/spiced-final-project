import { useEffect, useState } from "react";
import axios from "axios";

export default function RecipeItemsForm({ recipe_items, editMode }) {
    const [items, setItems] = useState([]);
    const [edit, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setItems(recipe_items);
        console.log(recipe_items, "changed");
    }, [recipe_items]);

    useEffect(() => {
        setEditMode(editMode);
    }, [editMode]);

    function onChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        console.log(formData);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log(event.target);
        console.log("f", formData);
        const result = await axios.post("/api/recipes/buy", formData);
        console.log(result);
        setFormData({});
    }

    return (
        <div>
            RecipeItemsForm
            <form
                method="POST"
                action="/api/recipes/buy"
                onSubmit={(event) => handleSubmit(event)}
            >
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            <input
                                type="checkbox"
                                id={item.id}
                                name={item.item_name}
                                value={item.id}
                                onChange={(event) => onChange(event)}
                                defaultChecked={!item.exists}
                            ></input>
                            <label htmlFor={item.id}>{item.item_name}</label>
                            {edit && <button>remove</button>}{" "}
                            {item.exists ? "Already on shopping list" : ""}
                        </li>
                    ))}
                </ul>
                <button type="submit">Add to shopping list</button>
            </form>
        </div>
    );
}
