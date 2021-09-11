import ShoppingListItem from "./ShoppingListItem";
// import ShoppingInput from "./ShoppingInput";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ShoppingList() {
    const [itemData, setItemData] = useState([]);
    const [renderItems, setRenderItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [addItem, setAddItem] = useState(false);
    const [showFilterTagModal, setShowFilterTagModal] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);

    useEffect(async () => {
        const { data } = await axios.get("/api/shopping/items");
        setItemData(data);
    }, []);

    useEffect(() => {
        let res = itemData.filter(
            (x) =>
                x.item_name.toLowerCase().indexOf(newItem.toLowerCase()) != -1
        );
        if (filteredTags.length) {
            res = res.filter(
                (item) =>
                    item.tags.filter(
                        (tag) => filteredTags.indexOf(tag.tag_name) > -1
                    ).length > 0
            );
        }
        setRenderItems(res);
    }, [itemData, newItem, filteredTags]);

    useEffect(async () => {
        setShowResults(false);
        if (newItem == "") {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        const result = await axios.get("/api/ingredients/search?q=" + newItem);
        setSearchResults(result.data);
        setShowResults(true);
    }, [newItem]);

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

    async function onCheckItem(id, checked) {
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
    }

    function onClearInput() {
        setNewItem("");
    }

    async function onAdd() {
        if (newItem == "") return;
        try {
            const { data } = await axios.post("/api/shopping/add", { newItem });
            if (data.error) {
                console.error(data.error);
            } else {
                setItemData([data, ...itemData]);
            }
        } catch (error) {
            console.error("onAdd error", error);
        }
        setNewItem("");
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

    function onShowFilterTagModal() {
        setShowFilterTagModal(true);
    }

    function onCloseFilterTagModal() {
        setShowFilterTagModal(false);
    }

    function onFilterByTags() {
        onCloseFilterTagModal();
    }

    function onClearFilterByTags() {
        setFilteredTags([]);
    }

    function onChange(event) {
        setShowResults(false);
        setNewItem(event.target.value);
    }

    function onChangeTagFilter(event, tag) {
        if (event.target.checked) {
            if (filteredTags.includes(tag)) return;
            setFilteredTags((prev) => [...prev, tag]);
            return;
        }
        setFilteredTags((prev) => prev.filter((item) => item != tag));
    }

    function isChecked(tag) {
        return filteredTags.includes(tag);
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

    function getUsedTags() {
        return [
            ...new Set(
                itemData
                    .map((item) => {
                        return item.tags;
                    })
                    .map((tags) => tags.map((item) => item.tag_name))
                    .flat()
            ),
        ];
    }

    function renderTagFilterModal() {
        return (
            <div className={`modal ${showFilterTagModal ? "is-active" : ""}`}>
                <div
                    className="modal-background"
                    onClick={onCloseFilterTagModal}
                ></div>
                <div className="modal-content">
                    <div className="container m-3">
                        <div className="box">
                            <h2>Filter List by Tags </h2>
                            <div className="field is-grouped is-grouped-multiline">
                                {getUsedTags().map((tag) => {
                                    return (
                                        <div key={`${tag}`} className="control">
                                            <div className="tags"></div>
                                            <label
                                                htmlFor={tag}
                                                className="tag is-warning is-large is-rounded"
                                            >
                                                {tag}
                                                <span className="tag is-warning">
                                                    {" "}
                                                    <input
                                                        type="checkbox"
                                                        id={tag}
                                                        name={tag}
                                                        checked={isChecked(tag)}
                                                        onChange={(event) =>
                                                            onChangeTagFilter(
                                                                event,
                                                                tag
                                                            )
                                                        }
                                                    />
                                                </span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <button type="submit" onClick={onFilterByTags}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className="modal-close is-large"
                    onClick={onCloseFilterTagModal}
                    aria-label="close"
                ></button>
            </div>
        );
    }

    return (
        <div className="container has-text-centered shopping-container">
            <div>
                <h2 className="title">Shopping List</h2>

                {showFilterTagModal ? renderTagFilterModal() : ""}
                <button onClick={onShowFilterTagModal}>Filter</button>
                <button onClick={onClearFilterByTags}>Clear Filters</button>
            </div>
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
            <div className="columns mt-0 is-centered shopping-items">
                <div className="column is-half">
                    <div className="container shopping-items-container">
                        {renderItems.map((item) => (
                            <ShoppingListItem
                                key={item.id}
                                item={item}
                                setItemData={setItemData}
                                onDelete={onDelete}
                                onCheck={onCheckItem}
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
