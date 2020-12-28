"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeInput = exports.Recipe = exports.schemaDefinition = void 0;
exports.schemaDefinition = "\ninput RecipeInput {\n    name: String!\n    author: String!\n    description: String\n    ingredients: [String!]!\n    directions: [String!]!\n}\n\ntype Recipe {\n    id: ID!\n    name: String!\n    author: String!\n    description: String\n    ingredients: [String!]!\n    directions: [String!]!\n}\n\ntype Query {\n    getRecipe(id: ID!): Recipe\n    getRecipes(author: String): [Recipe!]!\n}\n\ntype Mutation {\n    createRecipe(input: RecipeInput): Recipe\n    updateRecipe(id: ID!, input: RecipeInput): Recipe\n    deleteRecipe(id: ID!, author: String!): Boolean\n}\n";
var Recipe = /** @class */ (function () {
    function Recipe(id, _a) {
        var name = _a.name, author = _a.author, description = _a.description, ingredients = _a.ingredients, directions = _a.directions;
        this.id = id;
        this.name = name;
        this.author = author;
        this.description = description;
        this.ingredients = ingredients;
        this.directions = directions;
    }
    return Recipe;
}());
exports.Recipe = Recipe;
var RecipeInput = /** @class */ (function () {
    function RecipeInput(name, author, description, ingredients, directions) {
        this.name = name;
        this.author = author;
        this.description = description;
        this.ingredients = ingredients;
        this.directions = directions;
    }
    return RecipeInput;
}());
exports.RecipeInput = RecipeInput;
