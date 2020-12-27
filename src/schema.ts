export const schemaDefinition = `
input RecipeInput {
    name: String!
    author: String!
    description: String
    ingredients: [String!]!
    directions: [String!]!
}

type Recipe {
    id: ID!
    name: String!
    author: String!
    description: String
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
    deleteRecipe(id: ID!): Boolean
}
`;

export class Recipe {
    id: string;
    name: string;
    author: string;
    description: string;
    ingredients: string[];
    directions: string[];
    constructor(id, {name, author, description, ingredients, directions}: RecipeInput) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.description = description;
        this.ingredients = ingredients;
        this.directions = directions;
    }
}

export class RecipeInput {
    name: string;
    author: string;
    description: string;
    ingredients: string[];
    directions: string[];
    constructor(name, author, description, ingredients, directions) {
        this.name = name;
        this.author = author;
        this.description = description;
        this.ingredients = ingredients;
        this.directions = directions;
    }
}