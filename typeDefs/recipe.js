const { gql } = require('apollo-server-express');


module.exports = gql `
    extend type Query{
        getRecipes: [Recipe!]
        getOneRecipe(name: String!): Recipe
        getMyRecipes: [Recipe!]
    }
    extend type Mutation {
        createRecipe(input: createRecipeInput): Recipe
        updateRecipe(input: updateRecipeInput): Recipe
    }
    input updateRecipeInput {
        name: String
        description: String
        ingredients: String
        categoryName: String
        userId: String
    }
    input createRecipeInput {
        name: String!
        description: String!
        ingredients: String!
        categoryName: String!
    }
    type Recipe{
        id: ID!
        name: String!
        description: String!
        ingredients: String!
        categoryName: String!
        category: Category
        user: User
        createdAt: Date!
        updateAt: Date!
    }
`;