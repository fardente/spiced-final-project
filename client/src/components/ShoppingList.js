import ShoppingListItem from "./ShoppingListItem";
import ShoppingInput from "./ShoppingInput";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ShoppingList() {
    const [items, setItems] = useState([]);

    useEffect(async () => {
        const { data } = await axios.get("/api/shopping/items");
        setItems(data);
    }, []);

    async function onDelete(id) {
        try {
            await axios.post("/api/shopping/delete", { id });
        } catch (error) {
            console.error("error deleting", error);
        }
        setItems((items) => items.filter((item) => item.id != id));
    }

    async function onCheck(id, checked) {
        try {
            await axios.put("/api/shopping/check", { id, checked });
        } catch (error) {
            console.error("error checking", error);
        }
        setItems((items) =>
            items.map((item) => {
                if (item.id == id) {
                    item.checked = checked;
                }
                return item;
            })
        );
    }

    return (
        <div>
            <div>
                {items.map((item) => (
                    <ShoppingListItem
                        key={item.id}
                        id={item.id}
                        item_name={item.item_name}
                        checked={item.checked}
                        onDelete={onDelete}
                        onCheck={onCheck}
                    />
                ))}
            </div>
            <ShoppingInput />
        </div>
    );
}
