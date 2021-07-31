export default function RecipeForm() {
    return (
        <div>
            <h2>Add a recipe</h2>
            <form>
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Recipe Name"
                    ></input>
                </div>
                <div>
                    <textarea placeholder="Add preparation steps here..."></textarea>
                </div>
            </form>
        </div>
    );
}
