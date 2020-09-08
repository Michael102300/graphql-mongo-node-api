const { combineResolvers } = require('graphql-resolvers');


const {recipes, users, categorys } = require('../constants')
const Recipe = require('../database/models/recipe');
const User = require('../database/models/user');
const Category = require('../database/models/category');


const { isAtuthenticated, isRecipeOwner } = require('./middleware')


module.exports = {
    Query: {
        getRecipes: combineResolvers( isAtuthenticated, async () => {
            try {
                const recipes = await Recipe.find()
                return recipes
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        getOneRecipe: combineResolvers(isAtuthenticated, async (_, { name }) => {
            try {
                const recipe = await Recipe.findOne({ name: name})
                return recipe;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
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
                const category = await Category.findOne({ name: input.categoryName })
                const recipe = new Recipe({ ...input, user: user.id, category: category.id });
                const result = await recipe.save();
                user.recipes.push(result.id);
                category.recipes.push(result.id);
                await user.save();
                await category.save();
                
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        updateRecipe: combineResolvers( isAtuthenticated, isRecipeOwner, async(_,{ id, input } ) => {
            try {
                const recipe = await Recipe.findByIdAndUpdate(id, {...input}, {new: true})
                return recipe;
            } catch (error) {
                console.log(error);
                throw error;
            }
        }),
        deleteRecipe: combineResolvers( isAtuthenticated, isRecipeOwner, async(_, { id }, { loggedInUserId }) => {
            try {
                const recipe = await Recipe.findByIdAndDelete(id);
                await User.updateOne({ _id: loggedInUserId }, { $pull: { recipes: recipe.id } })
                await Category.updateOne({_id: loggedInUserId },{$pull: { recipes: recipe.id}})
                return recipe;
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