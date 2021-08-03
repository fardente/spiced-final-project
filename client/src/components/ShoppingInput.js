export default function ShoppingInput() {
    return (
        <div className="inputBoxRow field">
            <div className="inputGroup control">
                <input
                    className="input is-large"
                    type="text"
                    placeholder="Add item..."
                ></input>
                <button className="button is-large is-success">
                    <span className="icon is-large">
                        <ion-icon
                            name="add-outline"
                            className="is-large"
                        ></ion-icon>
                    </span>
                </button>
            </div>
        </div>
    );
}
