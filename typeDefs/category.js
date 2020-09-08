const { gql } = require('apollo-server-express');

module.exports = gql `
    extend type Query{
        getCategories: [Category!]
        getOneCategory(name: String!): Category
    }
    extend type Mutation{
        createCategory(input: createCategoryInput): Category!
        updateCategory(input: updateCategoryInput): Category
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