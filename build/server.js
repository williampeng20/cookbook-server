"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var expressGraphQl = require("express-graphql");
var graphQl = require("graphql");
var cors = require("cors");
var schema_1 = require("./schema");
var graphqlHTTP = expressGraphQl.graphqlHTTP;
var buildSchema = graphQl.buildSchema;
// TODO: Migrate to a Database Server
var fakeDb = {};
var root = {
    getRecipe: function (_a) {
        var id = _a.id;
        if (!fakeDb[id]) {
            throw new Error("No recipe exists with id: " + id);
        }
        return new schema_1.Recipe(id, fakeDb[id]);
    },
    getRecipes: function (_a) {
        var author = _a.author;
        var recipes = [];
        for (var _i = 0, _b = Object.entries(fakeDb); _i < _b.length; _i++) {
            var _c = _b[_i], id = _c[0], recipe = _c[1];
            if (!author || (author == recipe.author)) {
                recipes.push(recipe);
            }
        }
        return recipes;
    },
    createRecipe: function (_a) {
        var input = _a.input;
        var id = require('crypto').randomBytes(10).toString('hex');
        if (input.name && input.author && input.ingredients && input.directions) {
            fakeDb[id] = input;
            return new schema_1.Recipe(id, input);
        }
        else {
            throw new Error('Missing fields in Recipe input');
        }
    },
    updateRecipe: function (_a) {
        var id = _a.id, input = _a.input;
        if (!fakeDb[id]) {
            throw new Error("No recipe exists with id: " + id);
        }
        if (input.name && input.author && input.ingredients && input.directions) {
            fakeDb[id] = input;
            return new schema_1.Recipe(id, input);
        }
        else {
            throw new Error('Missing fields in Recipe input');
        }
    },
};
var schema = buildSchema(schema_1.schemaDefinition);
var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running GraphQL API server at http://localhost:4000/graphql');
