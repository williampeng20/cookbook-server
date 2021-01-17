export const schemaDefinition = `
input RecipeInput {
    name: String!
    authorName: String!
    authorId: String!
    description: String!
    directions: [String!]!
    servingSize: Int!
}

input IngredientInput {
    name: String!
    amount: Float!
    unit: String!
}

type Ingredient {
    id: ID!
    name: String!
    amount: Float!
    unit: String!
}

type Recipe {
    id: ID!
    name: String!
    authorName: String!
    authorId: String!
    description: String!
    directions: [String!]!
    ingredients: [Ingredient!]!
    servingSize: Int!
}

type Query {
    getRecipe(id: ID!): Recipe
    getRecipes(authorId: String): [Recipe!]!
}

type Mutation {
    createRecipe(recipe: RecipeInput!, ingredients: [IngredientInput!]!): Recipe
    updateRecipe(id: ID!, recipe: RecipeInput!, ingredients: [IngredientInput!]!): Recipe
    deleteRecipe(id: ID!, authorId: String!): Boolean
}
`;

export class Recipe {
    id: string;
    name: string;
    authorName: string;
    authorId: string;
    description: string;
    directions: string[];
    ingredients: Ingredient[];
    servingSize: number;
    constructor(id, recipe: RecipeInput, ingredients: Ingredient[]) {
        this.id = id;
        this.name = recipe.name;
        this.authorName = recipe.authorName;
        this.authorId = recipe.authorId;
        this.description = recipe.description;
        this.directions = recipe.directions;
        this.ingredients = ingredients;
        this.servingSize = recipe.servingSize;
    }
}

export class RecipeInput {
    name: string;
    authorName: string;
    authorId: string;
    description: string;
    directions: string[];
    servingSize: number;
    constructor(name, authorName, authorId, description, directions, servingSize) {
        this.name = name;
        this.authorName = authorName;
        this.authorId = authorId;
        this.description = description;
        this.directions = directions;
        this.servingSize = servingSize;
    }
}

export class Ingredient {
    id: string;
    name: string;
    amount: number;
    unit?: string;
    constructor(id, name, amount, unit) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
}

export class IngredientInput {
    name: string;
    amount: number;
    unit?: string;
    constructor(name, amount, unit) {
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
}

// Storing Ingredients by ID for key string inside Database
export type IngredientsContainer = {[key:string]: Ingredient};