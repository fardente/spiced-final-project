export default function ShoppingListItem({
    id,
    item_name,
    checked,
    onDelete,
    onCheck,
}) {
    /*
      <button class="button">
    <span class="icon is-small">
      <i class="fas fa-bold"></i>
    </span>
  </button>
    */

    function showModal() {
        console.log("clicked", item_name);
        return (

        );
    }

    return (
        <div className="columns is-mobile">
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
                <button className="button is-text" onClick={showModal}>
                    {item_name}
                </button>
                <div className="tags">
                    <span className="tag is-black">Edeka</span>
                    <span className="tag is-black">Edeka</span>
                    <span className="tag is-black">Edeka</span>
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
        </div>
    );
}
