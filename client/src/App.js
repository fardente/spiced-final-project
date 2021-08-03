import { BrowserRouter, Route, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import ShoppingList from "./components/ShoppingList";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";
import RecipeForm from "./components/RecipeForm";
import IngredientManager from "./components/IngredientManager";

export default function App() {
    return (
        <BrowserRouter>
            <Nav />

            <section className="section p-5 ">
                <Route exact path="/" component={ShoppingList} />
                <Route exact path="/recipes" component={RecipeList} />
                <Route
                    exact
                    path="/ingredients"
                    component={IngredientManager}
                />
                <Switch>
                    <Route path="/recipes/add" component={RecipeForm} />
                    <Route path="/recipes/:id" component={RecipeDetails} />
                </Switch>
            </section>
        </BrowserRouter>
    );
}
