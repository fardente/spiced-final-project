import ShoppingListItem from "./ShoppingListItem";
// import ShoppingInput from "./ShoppingInput";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ShoppingList() {
    const [items, setItems] = useState([]);
    const [tempItems, setTempItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newItem, setNewItem] = useState("");

    useEffect(async () => {
        const { data } = await axios.get("/api/shopping/items");
        console.log("items", data);
        setItems(data);
        setTempItems(data);
    }, []);

    useEffect(() => {
        const res = tempItems.filter(
            (x) =>
                x.item_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
                -1
        );
        setItems(res);
    }, [searchTerm]);

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

    async function onAdd() {
        if (newItem == "") return;
        try {
            const { data } = await axios.post("/api/shopping/add", { newItem });
            console.log(data);
            if (data.error) {
                return;
            }
            setItems([data, ...items]);
            setNewItem("");
        } catch (error) {
            console.log("onAdd error", error);
        }
    }

    function checkKey(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            onAdd();
        }
    }

    function onSearch(event) {
        setSearchTerm(event.target.value);
    }

    function onChange(event) {
        setNewItem(event.target.value);
    }

    return (
        <div className="container has-text-centered mb-6">
            <h2 className="title">Shopping List</h2>
            <div className="container searchbox mb-5">
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        name="searchTerm"
                        id="searchInput"
                        placeholder="Filter list..."
                        value={searchTerm}
                        onChange={(event) => onSearch(event)}
                    ></input>{" "}
                    <span className="icon is-small is-left">
                        <ion-icon name="search-outline"></ion-icon>
                    </span>
                </div>
                <div className="control">
                    <a
                        className="button"
                        onClick={() => {
                            setSearchTerm("");
                        }}
                    >
                        <span className="icon is-small is-left">
                            <ion-icon name="close-outline"></ion-icon>
                        </span>
                    </a>
                </div>
            </div>
            <div className="columns is-centered">
                <div className="column is-half">
                    <div className="container">
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
                    {/* <ShoppingInput /> */}
                    <div className="inputBoxRow field">
                        <div className="inputGroup control">
                            <input
                                className="input is-medium"
                                type="text"
                                placeholder="Add item..."
                                value={newItem}
                                onKeyPress={checkKey}
                                onChange={(event) => onChange(event)}
                            ></input>
                            <button
                                onClick={() => onAdd()}
                                className="button is-medium is-success"
                            >
                                <span className="icon is-large">
                                    <ion-icon
                                        name="add-outline"
                                        className="is-large"
                                    ></ion-icon>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
