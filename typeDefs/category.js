const { gql } = require('apollo-server-express');

module.exports = gql `
    extend type Query{
        getCategories: [Category!]
        getOneCategory(name: String!): Category
    }
    extend type Mutation{
        createCategory(input: createCategoryInput!): Category
        updateCategory(id: ID!, input: updateCategoryInput!): Category
        deleteCategory(id: ID!): Category
    }
    input createCategoryInput{
        name: String!
    }
    input updateCategoryInput {
        name: String
    }
    type Category {
        id: ID!
        name: String!
        recipes: [Recipe!]
    }
`;