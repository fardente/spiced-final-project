import { useState } from "react";
import axios from "axios";

export default function ShoppingItemDetails({
    showItemDetails,
    onShowItemDetailsClick,
    item,
    setItemData,
}) {
    const { item_name } = item;

    const [newTag, setNewTag] = useState("");

    function onChangeTag(event) {
        console.log(event.target.value);
        setNewTag(event.target.value);
    }

    async function onAddTag() {
        console.log("add tag");
        const response = await axios.post("/api/tags", {
            tag_name: newTag,
            shopping_item_id: item.id,
        });
        const tagToAdd = { tag_id: response.data[0].tag_id, tag_name: newTag };
        setItemData((prev) => {
            console.log("prev", prev, tagToAdd);
            return prev.map((prev_item) => {
                console.log("state_item", prev_item, item.id);
                if (prev_item.id == item.id) {
                    console.log("pushing", tagToAdd);
                    prev_item.tags.push(tagToAdd);
                }
                return prev_item;
            });
        });
        console.log("newtag", response.data[0]);
    }

    async function onRemoveTag(tag_id) {
        console.log("remove tag", tag_id);
        const response = await axios.post("/api/tags/remove", {
            tag_id,
            shopping_item_id: item.id,
        });
        console.log("details delete tag", response);
        setItemData((prev) => {
            return prev.map((prev_item) => {
                if (prev_item.id == item.id) {
                    prev_item.tags = prev_item.tags.filter(
                        (tag) => tag.tag_id != tag_id
                    );
                }
                return prev_item;
            });
        });
    }
    return (
        <div className={`modal ${showItemDetails ? "is-active" : ""}`}>
            <div
                className="modal-background"
                onClick={onShowItemDetailsClick}
            ></div>
            <div className="modal-content">
                <div className="container m-3">
                    <div className="box">
                        {item_name}
                        <div className="tags are-large is-flex-direction-column is-align-items-flex-start">
                            {item.tags.map((tag) => {
                                console.log("item", item, "tag", tag);
                                return (
                                    <span
                                        key={`${tag.tag_id}`}
                                        className="tag is-warning is-rounded"
                                    >
                                        {tag.tag_name}
                                        <button
                                            className="delete is-large"
                                            onClick={() =>
                                                onRemoveTag(tag.tag_id)
                                            }
                                        ></button>
                                    </span>
                                );
                            })}
                        </div>
                        <div>
                            <input
                                type="text"
                                placehold="Add tag..."
                                value={newTag}
                                onChange={onChangeTag}
                            ></input>
                            <button type="submit" onClick={onAddTag}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <button
                className="modal-close is-large"
                onClick={onShowItemDetailsClick}
                aria-label="close"
            ></button>
        </div>
    );
}
