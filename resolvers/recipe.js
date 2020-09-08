const { combineResolvers } = require('graphql-resolvers');


const {recipes, users, categorys } = require('../constants')
const Recipe = require('../database/models/recipe');
const User = require('../database/models/user');
const { isAtuthenticated, isRecipeOwner } = require('./middleware')


module.exports = {
    Query: {
        getRecipes: async () => {
            try {
                const recipes = await Recipe.find()
                return recipes
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        getOneRecipe: async (_, { name }) => {
            try {
                const recipe = await Recipe.findOne({ name: name})
                return recipe;
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        getMyRecipes: combineResolvers( isAtuthenticated, async(_,__,{ loggedInUserId }) => {
            try {
                const recipes = await Recipe.find({ user: loggedInUserId })
                return recipes;
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Mutation:{
        createRecipe: combineResolvers( isAtuthenticated, async (_,{ input }, { email }) => {
            try {
                const user = await User.findOne({ email })
                const recipe = new Recipe({ ...input, user: user.id });
                const result = await recipe.save();
                user.recipes.push(result.id);
                await user.save();
                
            } catch (error) {
                console.log(error);
                throw error;
            }
        })
    },
    Recipe: {
        user: async(parent) => {
            try {
                const user = await User.findById(parent.user);
                return user
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
}