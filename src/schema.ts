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
}
`;

export class Recipe {
    id: string;
    name: string;
    author: string;
    ingredients: string[];
    directions: string[];
    constructor(id, {name, author, ingredients, directions}) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.ingredients = ingredients;
        this.directions = directions;
    }
}