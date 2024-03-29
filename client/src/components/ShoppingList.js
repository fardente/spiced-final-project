import ShoppingListItem from "./ShoppingListItem";
// import ShoppingInput from "./ShoppingInput";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ShoppingList() {
    const [itemData, setItemData] = useState([]);
    const [currentInputValue, setCurrentInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showFilterTagModal, setShowFilterTagModal] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);

    function filterItems(items) {
        const bySearch = filterItemsBySearch(items);
        if (filteredTags.length) {
            return filterItemsByTag(bySearch);
        }
        return bySearch;
    }

    function filterItemsBySearch(items) {
        return items.filter(
            (x) =>
                x.item_name
                    .toLowerCase()
                    .indexOf(currentInputValue.toLowerCase()) != -1
        );
    }

    function filterItemsByTag(items) {
        return items.filter(
            (item) =>
                item.tags.filter(
                    (tag) => filteredTags.indexOf(tag.tag_name) > -1
                ).length > 0
        );
    }

    useEffect(async () => {
        const { data } = await axios.get("/api/shopping/items");
        setItemData(data);
    }, []);

    useEffect(async () => {
        if (currentInputValue === "") {
            setSuggestions([]);
            setShowSuggestions(false);
        } else {
            const result = await axios.get(
                "/api/ingredients/search?q=" + currentInputValue
            );
            setSuggestions(result.data);
            setShowSuggestions(true);
        }
    }, [currentInputValue]);

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
        setCurrentInputValue("");
    }

    async function onAdd(inputValue) {
        if (inputValue == "") return;
        try {
            const { data } = await axios.post("/api/shopping/add", {
                newItem: inputValue,
            });
            if (data.error) {
                console.error(data.error);
            } else {
                setItemData([data, ...itemData]);
            }
        } catch (error) {
            console.error("onAdd error", error);
        }
        setCurrentInputValue("");
    }

    function checkKey(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            onAdd(currentInputValue);
        }
    }

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

    function onType(event) {
        setCurrentInputValue(event.target.value);
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

    function isAlreadyOnList(itemInput) {
        const filtered = itemData.filter((item) => item.item_name == itemInput);
        if (filtered.length > 0) {
            return true;
        }
        return false;
    }

    function renderSuggestions() {
        return suggestions.map((item) => {
            if (isAlreadyOnList(item.item_name)) return;
            return (
                <div key={item.id} className="shopping-search-result">
                    <div
                        onClick={() => onAdd(item.item_name)}
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
                                <button
                                    className="button"
                                    onClick={onFilterByTags}
                                >
                                    Save
                                </button>
                                <button
                                    className="button"
                                    onClick={onClearFilterByTags}
                                >
                                    Clear Filters
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

    let filteredItems = filterItems(itemData);
    return (
        <div className="container has-text-centered shopping-container">
            <div className="is-relative">
                <h2 className="title">Shopping List</h2>

                {showFilterTagModal ? renderTagFilterModal() : ""}
                <button
                    className="button btnFilter"
                    onClick={onShowFilterTagModal}
                >
                    Filter
                </button>
            </div>
            <div className="columns mt-0 is-centered shopping-items">
                <div className="column is-half">
                    <div className="container shopping-items-container">
                        {filteredItems.map((item) => (
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
                    {showSuggestions ? renderSuggestions() : ""}
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
                        value={currentInputValue}
                        onKeyPress={checkKey}
                        onChange={(event) => onType(event)}
                    ></input>
                    <button
                        onClick={() => onAdd(currentInputValue)}
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
