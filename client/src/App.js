import { BrowserRouter, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ShoppingList from "./components/ShoppingList";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";

export default function App() {
    return (
        <div>
            <h1>Recipe Manager 0.0.1</h1>
            <BrowserRouter>
                <section className="app">
                    <header>
                        <Nav />
                    </header>
                    <Route exact path="/" component={ShoppingList} />
                    <Route exact path="/recipes" component={RecipeList} />
                    <Route path="/recipes/:id" component={RecipeDetails} />
                </section>
            </BrowserRouter>
        </div>
    );
}
