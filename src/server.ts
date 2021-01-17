import express = require('express');
import cors = require('cors');
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { schemaDefinition } from './schema';
import { rootResolver } from './firebaseServer';
// import passport from './passport';

var schema = buildSchema(schemaDefinition);
var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true,
}));
app.listen(4000);
console.log('Running GraphQL API server at http://localhost:4000/graphql');
