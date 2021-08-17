import ShoppingListItem from "./ShoppingListItem";
// import ShoppingInput from "./ShoppingInput";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ShoppingList() {
    const [itemData, setItemData] = useState([]);
    const [renderItems, setRenderItems] = useState([]);
    const [filterTerm, setFilterTerm] = useState("");
    const [newItem, setNewItem] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [addItem, setAddItem] = useState(false);

    useEffect(async () => {
        const { data } = await axios.get("/api/shopping/items");
        setItemData(data);
    }, []);

    useEffect(() => {
        setRenderItems(itemData);
    }, [itemData]);

    useEffect(() => {
        const res = itemData.filter(
            (x) =>
                x.item_name.toLowerCase().indexOf(filterTerm.toLowerCase()) !=
                -1
        );
        setRenderItems(res);
    }, [filterTerm]);

    useEffect(async () => {
        setShowResults(false);
        if (searchTerm == "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        const result = await axios.get(
            "/api/ingredients/search?q=" + searchTerm
        );
        setSearchResults(result.data);
        setShowResults(true);
    }, [searchTerm]);

    useEffect(() => {
        if (addItem) {
            onAdd();
        }
    }, [addItem]);

    async function onDelete(id) {
        try {
            await axios.post("/api/shopping/delete", { id });
        } catch (error) {
            console.error("error deleting", error);
        }
        setItemData((items) => items.filter((item) => item.id != id));
    }

    async function onCheck(id, checked) {
        try {
            await axios.put("/api/shopping/check", { id, checked });
        } catch (error) {
            console.error("error checking", error);
        }
        setItemData((items) =>
            items.map((item) => {
                if (item.id == id) {
                    item.checked = checked;
                }
                return item;
            })
        );
        setRenderItems(itemData);
    }

    function onClearInput() {
        setNewItem("");
        setFilterTerm("");
        setSearchTerm("");
    }

    async function onAdd() {
        if (newItem == "") return;
        try {
            const { data } = await axios.post("/api/shopping/add", { newItem });
            if (data.error) {
                console.log(data.error);
            } else {
                setItemData([data, ...itemData]);
            }
        } catch (error) {
            console.log("onAdd error", error);
        }
        setNewItem("");
        setFilterTerm("");
        setSearchTerm("");
        setAddItem(false);
    }

    function checkKey(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            onAdd();
        }
    }

    // function onFilter(event) {
    //     setFilterTerm(event.target.value);
    // }

    function onChange(event) {
        setShowResults(false);
        setNewItem(event.target.value);
        setSearchTerm(event.target.value);
        setFilterTerm(event.target.value);
    }

    function checkExists(itemInput) {
        const filtered = renderItems.filter(
            (item) => item.item_name == itemInput
        );
        if (filtered.length > 0) {
            return true;
        }
        return false;
    }

    function onClickResult(item_name) {
        setNewItem(item_name);
        setShowResults(false);
        setAddItem(true);
    }

    function renderResults() {
        return searchResults.map((item) => {
            if (checkExists(item.item_name)) return;
            return (
                <div key={item.id} className="shopping-search-result">
                    <div
                        onClick={() => onClickResult(item.item_name)}
                        className="button is-light"
                    >
                        {item.item_name}
                        {/* <span className="icon is-small">
                            {checkExists(item.item_name) ? (
                                <ion-icon name="checkmark-done-outline"></ion-icon>
                            ) : (
                                <ion-icon name="checkmark-outline"></ion-icon>
                            )}
                        </span> */}
                    </div>
                </div>
            );
        });
    }

    return (
        <div className="container has-text-centered shopping-container">
            <h2 className="title">Shopping List</h2>
            {/* <div className="container searchbox">
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="text"
                        name="filterInput"
                        placeholder="Filter list..."
                        value={filterTerm}
                        onChange={(event) => onFilter(event)}
                    ></input>{" "}
                    <span className="icon is-small is-left">
                        <ion-icon name="search-outline"></ion-icon>
                    </span>
                </div>
                <div className="control">
                    <a
                        className="button"
                        onClick={() => {
                            setFilterTerm("");
                        }}
                    >
                        <span className="icon is-small is-left">
                            <ion-icon name="close-outline"></ion-icon>
                        </span>
                    </a>
                </div>
            </div> */}
            <div className="columns is-centered shopping-items">
                <div className="column is-half">
                    <div className="container">
                        {renderItems.map((item) => (
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
                </div>
            </div>
            {/* <ShoppingInput /> */}
            <div className="inputBoxRow field">
                <div className="shopping-search-results has-background-dark">
                    {showResults ? renderResults() : ""}
                </div>
                <div className="inputGroup control">
                    <button
                        onClick={() => onClearInput()}
                        className="button is-medium"
                    >
                        <span className="icon is-large">
                            <ion-icon
                                name="close-outline"
                                className="is-large"
                            ></ion-icon>
                        </span>
                    </button>
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
    );
}
