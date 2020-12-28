import admin = require("firebase-admin");
import { Recipe, RecipeInput } from './schema';

// Place firebase-creds.json at the root of the package
const credsPath = `${process.cwd()}\\firebase-creds.json`;
var serviceAccount = require(credsPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cookbook-db-37eb5-default-rtdb.firebaseio.com"
});

const db = admin.database();

export const rootResolver = {
    getRecipe: ({id}) => {
        const ref = db.ref(`recipes/${id}`);
        return ref.once("value").then((snapshot) => {
            const rcp = snapshot.val();
            if (!rcp) {
                throw new Error(`No recipe exists with id: ${id}`);
            }
            const rcpInput = {
                name: rcp.name,
                author: rcp.author,
                description: rcp.description,
                ingredients: rcp.ingredients,
                directions: rcp.directions,
            };
            return new Recipe(id, rcpInput);
        }).catch((error) => {
            console.log(error);
            throw new Error(`Getting recipe ${id} failed.`);
        });
    },
    getRecipes: ({author}) => {
        if (author) {
            const authorRef = db.ref(`authors/${author}/recipes`);
            return authorRef.once("value").then((snapshot) => {
                const rcpIds: {[key:string]: boolean} = snapshot.val();
                const rcpPromises = [];
                for (const [id, _] of Object.entries(rcpIds)) {
                    const recipeRef = db.ref(`recipes/${id}`);
                    rcpPromises.push( recipeRef.once("value").then((snap) => {
                        const rcp = snap.val();
                        const rcpInput = {
                            name: rcp.name,
                            author: rcp.author,
                            description: rcp.description,
                            ingredients: rcp.ingredients,
                            directions: rcp.directions,
                        };
                        return new Recipe(id, rcpInput);
                    }).catch((error) => {
                        console.log(error);
                    }) );
                }
                return Promise.all(rcpPromises).then((values) => {
                    return values;
                });
            }).catch((error) => {
                console.log(error);
                throw new Error(`Getting recipes for author: ${author} failed.`);
            });
        }
        const ref = db.ref('recipes');
        return ref.once("value").then((snapshot) => {
            const rcps: {[key:string]: RecipeInput} = snapshot.val();
            const recipes = [];
            for (const [id, recipe] of Object.entries(rcps)) {
                recipes.push(new Recipe(id, recipe));
            }
            return recipes;
        }).catch((error) => {
            console.log(error);
            throw new Error('Get recipes operation failed.');
        });
    },
    createRecipe: ({input}) => {
        var id = require('crypto').randomBytes(10).toString('hex');
        if (input.name && input.author && input.ingredients && input.directions) {
            const recipeRef = db.ref(`recipes/${id}`);
            return recipeRef.set({
                name: input.name,
                author: input.author,
                description: input.description,
                ingredients: input.ingredients,
                directions: input.directions,
            }).then((val) => {
                const authorRef = db.ref(`authors/${input.author}/recipes/${id}`);
                return authorRef.set(true).then((val) => {
                    return new Recipe(id, input);
                }).catch((error) => {
                    console.log(error);
                    throw new Error('Setting recipe under author operation failed.');
                });
            }).catch((error) => {
                console.log(error);
                throw new Error('Create recipe operation failed.');
            });
        } else {
            throw new Error('Missing fields in Recipe input');
        }
    },
    updateRecipe: ({id, input}) => {
        if (input.name && input.author && input.ingredients && input.directions) {
            const ref = db.ref(`recipes/${id}`);
            return ref.set({
                name: input.name,
                author: input.author,
                description: input.description,
                ingredients: input.ingredients,
                directions: input.directions,
            }).then((val) => {
                return new Recipe(id, input);
            }).catch((error) => {
                console.log(error);
                throw new Error('Update recipe operation failed.');
            });
        } else {
            throw new Error('Missing fields in Recipe input');
        }
    },
    deleteRecipe: ({id, author}) => {
        const ref = db.ref(`recipes/${id}`);
        return ref.remove().then((val) => {
            const authorRef = db.ref(`authors/${author}/recipes/${id}`);
            return authorRef.remove().then((val) => {
                return true;
            });
        }).catch((error) => {
            console.log(error);
            throw new Error('Delete recipe operation failed.');
        });
    }
};
