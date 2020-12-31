"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientInput = exports.Ingredient = exports.RecipeInput = exports.Recipe = exports.schemaDefinition = void 0;
exports.schemaDefinition = "\ninput RecipeInput {\n    name: String!\n    author: String!\n    description: String!\n    directions: [String!]!\n    servingSize: Int!\n}\n\ninput IngredientInput {\n    name: String!\n    amount: Float!\n    unit: String!\n}\n\ntype Ingredient {\n    id: ID!\n    name: String!\n    amount: Float!\n    unit: String!\n}\n\ntype Recipe {\n    id: ID!\n    name: String!\n    author: String!\n    description: String!\n    directions: [String!]!\n    ingredients: [Ingredient!]!\n    servingSize: Int!\n}\n\ntype Query {\n    getRecipe(id: ID!): Recipe\n    getRecipes(author: String): [Recipe!]!\n}\n\ntype Mutation {\n    createRecipe(recipe: RecipeInput!, ingredients: [IngredientInput!]!): Recipe\n    updateRecipe(id: ID!, recipe: RecipeInput!, ingredients: [IngredientInput!]!): Recipe\n    deleteRecipe(id: ID!, author: String!): Boolean\n}\n";
var Recipe = /** @class */ (function () {
    function Recipe(id, recipe, ingredients) {
        this.id = id;
        this.name = recipe.name;
        this.author = recipe.author;
        this.description = recipe.description;
        this.directions = recipe.directions;
        this.ingredients = ingredients;
        this.servingSize = recipe.servingSize;
    }
    return Recipe;
}());
exports.Recipe = Recipe;
var RecipeInput = /** @class */ (function () {
    function RecipeInput(name, author, description, directions, servingSize) {
        this.name = name;
        this.author = author;
        this.description = description;
        this.directions = directions;
        this.servingSize = servingSize;
    }
    return RecipeInput;
}());
exports.RecipeInput = RecipeInput;
var Ingredient = /** @class */ (function () {
    function Ingredient(id, name, amount, unit) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
    return Ingredient;
}());
exports.Ingredient = Ingredient;
var IngredientInput = /** @class */ (function () {
    function IngredientInput(name, amount, unit) {
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
    return IngredientInput;
}());
exports.IngredientInput = IngredientInput;
