export default function ShoppingListItem({
    id,
    item_name,
    checked,
    onDelete,
    onCheck,
}) {
    return (
        <div>
            <div>
                <button onClick={() => onDelete(id)}>Delete</button>
            </div>
            <div>
                {item_name} {id}
            </div>
            <div>
                <button onClick={() => onCheck(id, !checked)}>
                    Check {checked ? "true" : "false"}
                </button>
            </div>
        </div>
    );
}
