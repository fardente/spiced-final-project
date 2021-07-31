import { useEffect, useState } from "react";

export default function RecipeItemsForm({ recipe_items, editMode }) {
    const [items, setItems] = useState([]);
    const [edit, setEditMode] = useState(false);

    useEffect(() => {
        setItems(recipe_items);
        console.log(recipe_items, "changed");
    }, [recipe_items]);

    useEffect(() => {
        setEditMode(editMode);
    }, [editMode]);

    return (
        <div>
            RecipeItemsForm
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {item.item_name} {edit && <button>remove</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
