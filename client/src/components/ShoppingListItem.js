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
    return (
        <div className="columns is-mobile">
            <div className="column is-flex-grow-0">
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
            <div className="column is-capitalized">{item_name}</div>
            <div className="column is-flex-grow-0">
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
