const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const cors = require('cors');
const donEnv = require('dotenv');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./database/util');
const { verifyUser } = require('./helper/context')
donEnv.config();

const app = express();

connection();

app.use(cors());
app.use(express.json());


const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        await verifyUser(req);
        return{
            email: req.email,
            loggedInUserId: req.loggedInUserId
        }
    }
})

apolloServer.applyMiddleware({app, path:'/graphql'})

const PORT = process.env.PORT || 3000;
app.use('/', (req,res, next) => {
    res.send({message: "Hello"});
});

app.listen(PORT, () => {
    console.log(`server listening in port: ${PORT}`)
})