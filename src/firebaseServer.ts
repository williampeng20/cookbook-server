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
            let rcp = snapshot.val();
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
        const ref = db.ref('recipes');
        return ref.once("value").then((snapshot) => {
            let rcps: {[key:string]: RecipeInput} = snapshot.val();
            const recipes = [];
            for (const [id, recipe] of Object.entries(rcps)) {
                if (!author || (author == recipe.author)) {
                    recipes.push(new Recipe(id, recipe));
                }
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
    deleteRecipe: ({id}) => {
        const ref = db.ref(`recipes/${id}`);
        return ref.remove().then((val) => {
            return true;
        }).catch((error) => {
            console.log(error);
            throw new Error('Delete recipe operation failed.');
        });
    }
};
