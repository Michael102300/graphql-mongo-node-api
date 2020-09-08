const { combineResolvers } = require('graphql-resolvers');

const { categorys, recipes, users} = require('../constants')
const Category = require('../database/models/category');
const Recipe = require('../database/models/recipe');
const { isAtuthenticated } = require('./middleware')
module.exports = {
    Query: {
        getCategories:combineResolvers (isAtuthenticated, async () => {
            try {
                const categories = await Category.find();
                return categories;
            } catch (error) {
                console.log(error);
                throw error;
            }
            
        }),
        getOneCategory:combineResolvers( isAtuthenticated, async (_, { name }) => {
            try {
                const category = await Category.findOne({name: name})
                return category;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Mutation: {
        createCategory: combineResolvers( isAtuthenticated, async(_, { input }) => {
            try {
                const category = await Category.findOne({ name: input.name})
                if(category){
                    throw new Error('Category already exists')
                }
                const newCategory = await new Category({...input})
                const result = await newCategory.save();
                return result;
                
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        updateCategory: combineResolvers( isAtuthenticated, async(_, { id, input }) => {
            try {
                const category = await Category.findByIdAndUpdate(id, {...input}, {new: true})
                return category;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Category: {
        recipes: async ( { name }) => {
            try {
                const recipes = await Recipe.find({ categoryName: name})
                return recipes
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
}