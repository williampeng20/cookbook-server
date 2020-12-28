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
            var rcpInput = {
                name: rcp.name,
                author: rcp.author,
                description: rcp.description,
                ingredients: rcp.ingredients,
                directions: rcp.directions,
            };
            return new schema_1.Recipe(id, rcpInput);
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
                        var rcpInput = {
                            name: rcp.name,
                            author: rcp.author,
                            description: rcp.description,
                            ingredients: rcp.ingredients,
                            directions: rcp.directions,
                        };
                        return new schema_1.Recipe(id, rcpInput);
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
                recipes.push(new schema_1.Recipe(id, recipe));
            }
            return recipes;
        }).catch(function (error) {
            console.log(error);
            throw new Error('Get recipes operation failed.');
        });
    },
    createRecipe: function (_a) {
        var input = _a.input;
        var id = require('crypto').randomBytes(10).toString('hex');
        if (input.name && input.author && input.ingredients && input.directions) {
            var recipeRef = db.ref("recipes/" + id);
            return recipeRef.set({
                name: input.name,
                author: input.author,
                description: input.description,
                ingredients: input.ingredients,
                directions: input.directions,
            }).then(function (val) {
                var authorRef = db.ref("authors/" + input.author + "/recipes/" + id);
                return authorRef.set(true).then(function (val) {
                    return new schema_1.Recipe(id, input);
                }).catch(function (error) {
                    console.log(error);
                    throw new Error('Setting recipe under author operation failed.');
                });
            }).catch(function (error) {
                console.log(error);
                throw new Error('Create recipe operation failed.');
            });
        }
        else {
            throw new Error('Missing fields in Recipe input');
        }
    },
    updateRecipe: function (_a) {
        var id = _a.id, input = _a.input;
        if (input.name && input.author && input.ingredients && input.directions) {
            var ref = db.ref("recipes/" + id);
            return ref.set({
                name: input.name,
                author: input.author,
                description: input.description,
                ingredients: input.ingredients,
                directions: input.directions,
            }).then(function (val) {
                return new schema_1.Recipe(id, input);
            }).catch(function (error) {
                console.log(error);
                throw new Error('Update recipe operation failed.');
            });
        }
        else {
            throw new Error('Missing fields in Recipe input');
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
