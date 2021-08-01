import { useState, useEffect } from "react";
import axios from "axios";

export default function IngredientManager() {
    const [ingredients, setIngredients] = useState([]);

    useEffect(async () => {
        try {
            const { data } = await axios.get("/api/ingredients");
            setIngredients(data);
            console.log(ingredients);
        } catch (error) {
            console.error("IngredientManager", error);
        }
    }, []);

    return (
        <div>
            <h2>Ingredients</h2>
            {ingredients &&
                ingredients.map((item) => (
                    <div key={item.id}>{item.item_name}</div>
                ))}
        </div>
    );
}
