"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootResolver = void 0;
var admin = require("firebase-admin");
var schema_1 = require("./schema");
// Place firebase-creds.json at the root of the package
var credsPath = process.cwd() + "\\firebase-creds.json";
var serviceAccount = require(credsPath);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cookbook-db-37eb5-default-rtdb.firebaseio.com"
});
var db = admin.database();
exports.rootResolver = {
    getRecipe: function (_a) {
        var id = _a.id;
        var ref = db.ref("recipes/" + id);
        return ref.once("value").then(function (snapshot) {
            var rcp = snapshot.val();
            if (!rcp) {
                throw new Error("No recipe exists with id: " + id);
            }
            rcp.id = id;
            rcp.ingredients = getIngredientsList(rcp.ingredients);
            return rcp;
        }).catch(function (error) {
            console.log(error);
            throw new Error("Getting recipe " + id + " failed.");
        });
    },
    getRecipes: function (_a) {
        var author = _a.author;
        if (author) {
            var authorRef = db.ref("authors/" + author + "/recipes");
            return authorRef.once("value").then(function (snapshot) {
                var rcpIds = snapshot.val();
                var rcpPromises = [];
                var _loop_1 = function (id, _) {
                    var recipeRef = db.ref("recipes/" + id);
                    rcpPromises.push(recipeRef.once("value").then(function (snap) {
                        var rcp = snap.val();
                        if (!rcp) {
                            throw new Error("No recipe exists with id: " + id);
                        }
                        rcp.id = id;
                        rcp.ingredients = getIngredientsList(rcp.ingredients);
                        return rcp;
                    }).catch(function (error) {
                        console.log(error);
                    }));
                };
                for (var _i = 0, _a = Object.entries(rcpIds); _i < _a.length; _i++) {
                    var _b = _a[_i], id = _b[0], _ = _b[1];
                    _loop_1(id, _);
                }
                return Promise.all(rcpPromises).then(function (values) {
                    return values;
                });
            }).catch(function (error) {
                console.log(error);
                throw new Error("Getting recipes for author: " + author + " failed.");
            });
        }
        var ref = db.ref('recipes');
        return ref.once("value").then(function (snapshot) {
            var rcps = snapshot.val();
            var recipes = [];
            for (var _i = 0, _a = Object.entries(rcps); _i < _a.length; _i++) {
                var _b = _a[_i], id = _b[0], recipe = _b[1];
                recipe.id = id;
                var igList = recipe.ingredients;
                recipe.ingredients = getIngredientsList(igList);
                recipes.push(recipe);
            }
            return recipes;
        }).catch(function (error) {
            console.log(error);
            throw new Error('Get recipes operation failed.');
        });
    },
    createRecipe: function (_a) {
        var recipe = _a.recipe, ingredients = _a.ingredients;
        var id = require('crypto').randomBytes(10).toString('hex');
        var promises = [];
        var ingredientContainer = {};
        if (ingredients) {
            ingredientContainer = getIngredientsContainer(ingredients);
        }
        if (ingredients && recipe && recipe.name && recipe.author && recipe.description
            && recipe.directions && recipe.servingSize) {
            var recipeRef = db.ref("recipes/" + id);
            promises.push(recipeRef.set({
                name: recipe.name,
                author: recipe.author,
                description: recipe.description,
                directions: recipe.directions,
                servingSize: recipe.servingSize,
                ingredients: ingredientContainer
            }).catch(function (error) {
                console.log(error);
                throw new Error('Create recipe operation failed.');
            }));
            var authorRef = db.ref("authors/" + recipe.author + "/recipes/" + id);
            promises.push(authorRef.set(true).catch(function (error) {
                console.log(error);
                throw new Error('Setting recipe under author operation failed.');
            }));
        }
        else {
            throw new Error('Missing fields in Recipe Input or Ingredients Input');
        }
        return Promise.all(promises).then(function (val) {
            return new schema_1.Recipe(id, recipe, getIngredientsList(ingredientContainer));
        });
    },
    updateRecipe: function (_a) {
        var id = _a.id, recipe = _a.recipe, ingredients = _a.ingredients;
        if (ingredients && recipe && recipe.name && recipe.author && recipe.description && recipe.directions
            && recipe.servingSize) {
            var recipeRef = db.ref("recipes/" + id);
            var ingredientContainer_1 = getIngredientsContainer(ingredients);
            return recipeRef.set({
                name: recipe.name,
                author: recipe.author,
                description: recipe.description,
                directions: recipe.directions,
                servingSize: recipe.servingSize,
                ingredients: ingredientContainer_1
            }).then(function (val) {
                return new schema_1.Recipe(id, recipe, getIngredientsList(ingredientContainer_1));
            }).catch(function (error) {
                console.log(error);
                throw new Error('Update recipe operation failed.');
            });
        }
        else {
            throw new Error('Missing fields in Recipe Input');
        }
    },
    deleteRecipe: function (_a) {
        var id = _a.id, author = _a.author;
        var ref = db.ref("recipes/" + id);
        return ref.remove().then(function (val) {
            var authorRef = db.ref("authors/" + author + "/recipes/" + id);
            return authorRef.remove().then(function (val) {
                return true;
            });
        }).catch(function (error) {
            console.log(error);
            throw new Error('Delete recipe operation failed.');
        });
    }
};
function getIngredientsList(ingredients) {
    var list = [];
    for (var _i = 0, _a = Object.entries(ingredients); _i < _a.length; _i++) {
        var _b = _a[_i], _ = _b[0], ingredient = _b[1];
        list.push(ingredient);
    }
    return list;
}
function getIngredientsContainer(ingredients) {
    var container = {};
    ingredients.map(function (ig) {
        var igId = require('crypto').randomBytes(4).toString('hex');
        return new schema_1.Ingredient(igId, ig.name, ig.amount, ig.unit);
    }).forEach(function (ig) {
        container[ig.id] = ig;
    });
    return container;
}
