var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors');
 
// Construct a schema, using GraphQL schema language
var schemaDefinition = `
input RecipeInput {
    name: String!
    author: String!
    ingredients: [String!]!
    directions: [String!]!
}

type Recipe {
    id: ID!
    name: String!
    author: String!
    ingredients: [String!]!
    directions: [String!]!
}

type Query {
    getRecipe(id: ID!): Recipe
    getRecipes(author: String): [Recipe!]!
}

type Mutation {
    createRecipe(input: RecipeInput): Recipe
    updateRecipe(id: ID!, input: RecipeInput): Recipe
}
`;

class Recipe {
    constructor(id, {name, author, ingredients, directions}) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.ingredients = ingredients;
        this.directions = directions;
    }
}

var schema = buildSchema(schemaDefinition);

// TODO: Migrate to a Database Server
var fakeDb = {};
var root = {
    getRecipe: ({id}) => {
        if (!fakeDb[id]) {
            throw new Error(`No recipe exists with id: ${id}`);
        }
        return new Recipe(id, fakeDb[id]);
    },
    getRecipes: ({author}) => {
        recipes = []
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
 
var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');