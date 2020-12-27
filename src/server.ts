import express = require('express');
import expressGraphQl = require('express-graphql');
import graphQl = require('graphql');
import cors = require('cors');
import { schemaDefinition } from './schema';
import { rootResolver } from './firebaseServer';
const { graphqlHTTP } = expressGraphQl;
const { buildSchema } = graphQl;

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
