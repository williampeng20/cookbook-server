import express = require('express');
import expressGraphQl = require('express-graphql');
import graphQl = require('graphql');
import cors = require('cors');
import { schemaDefinition, Recipe } from './schema';
const { graphqlHTTP } = expressGraphQl;
const { buildSchema } = graphQl;

// TODO: Migrate to a Database Server
var fakeDb: { [key: string]: Recipe} = {};
var root = {
    getRecipe: ({id}) => {
        if (!fakeDb[id]) {
            throw new Error(`No recipe exists with id: ${id}`);
        }
        return new Recipe(id, fakeDb[id]);
    },
    getRecipes: ({author}) => {
        const recipes = [];
        for (const [id, recipe] of Object.entries(fakeDb)) {
            if (!author || (author == recipe.author)) {
                recipes.push(recipe)
            }
        }
        return recipes;
    },
    createRecipe: ({input}) => {
        var id = require('crypto').randomBytes(10).toString('hex');
        if (input.name && input.author && input.ingredients && input.directions) {
            fakeDb[id] = input;
            return new Recipe(id, input);
        } else {
            throw new Error('Missing fields in Recipe input');
        }
    },
    updateRecipe: ({id, input}) => {
        if (!fakeDb[id]) {
            throw new Error(`No recipe exists with id: ${id}`);
        }
        if (input.name && input.author && input.ingredients && input.directions) {
            fakeDb[id] = input;
            return new Recipe(id, input);
        } else {
            throw new Error('Missing fields in Recipe input');
        }
    },
};


var schema = buildSchema(schemaDefinition);
var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running GraphQL API server at http://localhost:4000/graphql');