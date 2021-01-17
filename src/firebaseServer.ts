import admin = require("firebase-admin");
import { Recipe, RecipeInput, Ingredient, IngredientInput, IngredientsContainer } from './schema';

// Place firebase-creds.json at the root of the package
const credsPath = `${process.cwd()}/firebase-creds.json`;
var serviceAccount = require(credsPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cookbook-db-37eb5-default-rtdb.firebaseio.com"
});

const db = admin.database();

export const rootResolver = {
    getRecipe: ({id}: {id: string}) => {
        const ref = db.ref(`recipes/${id}`);
        return ref.once("value").then((snapshot) => {
            const rcp = snapshot.val();
            if (!rcp) {
                throw new Error(`No recipe exists with id: ${id}`);
            }
            rcp.id = id;
            rcp.ingredients = getIngredientsList(rcp.ingredients);
            return rcp as Recipe;
        }).catch((error) => {
            console.log(error);
            throw new Error(`Getting recipe ${id} failed.`);
        });
    },
    getRecipes: ({authorId}: {authorId: string}) => {
        if (authorId) {
            const authorRef = db.ref(`authors/${authorId}/recipes`);
            return authorRef.once("value").then((snapshot) => {
                const rcpIds: {[key:string]: boolean} = snapshot.val();
                const rcpPromises = [];
                for (const [id, _] of Object.entries(rcpIds)) {
                    const recipeRef = db.ref(`recipes/${id}`);
                    rcpPromises.push( recipeRef.once("value").then((snap) => {
                        const rcp = snap.val();
                        if (!rcp) {
                            throw new Error(`No recipe exists with id: ${id}`);
                        }
                        rcp.id = id;
                        rcp.ingredients = getIngredientsList(rcp.ingredients);
                        return rcp as Recipe;
                    }).catch((error) => {
                        console.log(error);
                    }) );
                }
                return Promise.all(rcpPromises).then((values) => {
                    return values;
                });
            }).catch((error) => {
                console.log(error);
                throw new Error(`Getting recipes for author: ${authorId} failed.`);
            });
        }
        const ref = db.ref('recipes');
        return ref.once("value").then((snapshot) => {
            const rcps: {[key:string]: Recipe} = snapshot.val();
            const recipes = [];
            for (const [id, recipe] of Object.entries(rcps)) {
                recipe.id = id;
                const igList: unknown = recipe.ingredients;
                recipe.ingredients = getIngredientsList(igList as IngredientsContainer);
                recipes.push(recipe);
            }
            return recipes;
        }).catch((error) => {
            console.log(error);
            throw new Error('Get recipes operation failed.');
        });
    },
    createRecipe: ({recipe, ingredients}: {recipe: RecipeInput, ingredients: IngredientInput[]}) => {
        const id = require('crypto').randomBytes(10).toString('hex');
        const promises = [];
        let ingredientContainer: IngredientsContainer = {};
        if (ingredients) {
            ingredientContainer = getIngredientsContainer(ingredients);
        }
        if (ingredients && recipe && recipe.name && recipe.authorId && recipe.authorName && recipe.description
            && recipe.directions && recipe.servingSize) {
            const recipeRef = db.ref(`recipes/${id}`);
            promises.push( recipeRef.set({
                name: recipe.name,
                authorName: recipe.authorName,
                authorId: recipe.authorId,
                description: recipe.description,
                directions: recipe.directions,
                servingSize: recipe.servingSize,
                ingredients: ingredientContainer
            }).catch((error) => {
                console.log(error);
                throw new Error('Create recipe operation failed.');
            }) );
            const authorRef = db.ref(`authors/${recipe.authorId}/recipes/${id}`);
            promises.push( authorRef.set(true).catch((error) => {
                console.log(error);
                throw new Error('Setting recipe under author operation failed.');
            }) );
        } else {
            throw new Error('Missing fields in Recipe Input or Ingredients Input');
        }
        return Promise.all(promises).then((val) => {
            return new Recipe(id, recipe, getIngredientsList(ingredientContainer));
        });
    },
    updateRecipe: ({id, recipe, ingredients}: {id: string, recipe: RecipeInput, ingredients: IngredientInput[]}) => {
        if (ingredients && recipe && recipe.name && recipe.authorId && recipe.authorName && recipe.description && recipe.directions
            && recipe.servingSize) {
            const recipeRef = db.ref(`recipes/${id}`);
            const ingredientContainer = getIngredientsContainer(ingredients);
            return recipeRef.set({
                name: recipe.name,
                authorName: recipe.authorName,
                authorId: recipe.authorId,
                description: recipe.description,
                directions: recipe.directions,
                servingSize: recipe.servingSize,
                ingredients: ingredientContainer
            }).then((val) => {
                return new Recipe(id, recipe, getIngredientsList(ingredientContainer));
            }).catch((error) => {
                console.log(error);
                throw new Error('Update recipe operation failed.');
            });
        } else {
            throw new Error('Missing fields in Recipe Input');
        }
    },
    deleteRecipe: ({id, authorId}: {id: string, authorId: string}) => {
        const ref = db.ref(`recipes/${id}`);
        return ref.remove().then((val) => {
            const authorRef = db.ref(`authors/${authorId}/recipes/${id}`);
            return authorRef.remove().then((val) => {
                return true;
            });
        }).catch((error) => {
            console.log(error);
            throw new Error('Delete recipe operation failed.');
        });
    }
};

function getIngredientsList(ingredients: IngredientsContainer): Ingredient[] {
    const list: Ingredient[] = [];
    for (const [_, ingredient] of Object.entries(ingredients)) {
        list.push(ingredient);
    }
    return list;
}

function getIngredientsContainer(ingredients: IngredientInput[]): IngredientsContainer {
    const container: IngredientsContainer = {};
    ingredients.map((ig) => {
        const igId = require('crypto').randomBytes(4).toString('hex');
        return new Ingredient(igId, ig.name, ig.amount, ig.unit);
    }).forEach((ig) => {
        container[ig.id] = ig;
    })
    return container;
}