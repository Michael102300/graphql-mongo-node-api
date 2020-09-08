const { skip } = require('graphql-resolvers');
const Recipe = require('../../database/models/recipe');
const { isValidObjectId } = require('../../database/util');


module.exports.isAtuthenticated = (_,__, { email })  => {
    if(!email){
        throw new Error('Access Denied!')
    }
    return skip;
}

module.exports.isRecipeOwner = async (_, { id }, { loggedInUserId }) => {
    try {
        if(!isValidObjectId(id)){
            throw new Error('invalid recipe id')
        }
        const recipe = await Recipe.findById(id);
        if(!recipe){
            throw new Error('Recipe not found!')
        }else if( recipe.user.toString() !== loggedInUserId){
            throw new Error('Not authorized')
        }
        return skip;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

