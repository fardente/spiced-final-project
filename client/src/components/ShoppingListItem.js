import { useState } from "react";
import ShoppingItemDetails from "./ShoppingItemDetails";

export default function ShoppingListItem({
    item,
    setItemData,
    onDelete,
    onCheck,
}) {
    const { id, item_name, checked } = item;
    /*
      <button class="button">
    <span class="icon is-small">
      <i class="fas fa-bold"></i>
    </span>
  </button>
    */
    const [showItemDetails, setShowItemDetails] = useState(false);

    function onShowItemDetailsClick() {
        setShowItemDetails((prev) => !prev);
    }

    function capitalize(input) {
        return input[0].toUpperCase() + input.slice(1);
    }

    return (
        <div
            className={`columns is-mobile shopping-item-wrapper ${
                checked ? "checked" : ""
            }`}
        >
            <div className="column is-flex-grow-0 shopping-item-button-div">
                <button
                    className="button is-outlined is-danger is-light"
                    onClick={() => onDelete(id)}
                >
                    {" "}
                    <span className="icon is-small">
                        <ion-icon name="trash-outline"></ion-icon>
                    </span>
                </button>
            </div>
            <div className="column is-capitalized shopping-item-text">
                <span
                    className="is-clickable is-underlined"
                    onClick={onShowItemDetailsClick}
                >
                    {capitalize(item_name)}
                </span>
                <div className="tags">
                    {item.tags.map((tag) => {
                        // console.log("item", item, "tag", tag);
                        return (
                            <span
                                key={`${tag.tag_id}`}
                                className="tag is-warning"
                            >
                                {tag.tag_name}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="column is-flex-grow-0 shopping-item-button-div">
                <button
                    className={`button ${
                        checked
                            ? "is-success"
                            : "is-outlined is-success is-light"
                    }`}
                    onClick={() => onCheck(id, !checked)}
                >
                    <span className="icon is-small">
                        {checked ? (
                            <ion-icon name="checkmark-done-outline"></ion-icon>
                        ) : (
                            <ion-icon name="checkmark-outline"></ion-icon>
                        )}
                    </span>
                </button>
            </div>
            {showItemDetails ? (
                <ShoppingItemDetails
                    item={item}
                    setItemData={setItemData}
                    showItemDetails={showItemDetails}
                    onShowItemDetailsClick={onShowItemDetailsClick}
                />
            ) : (
                ""
            )}
        </div>
    );
}
