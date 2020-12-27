"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var expressGraphQl = require("express-graphql");
var graphQl = require("graphql");
var cors = require("cors");
var schema_1 = require("./schema");
var firebaseServer_1 = require("./firebaseServer");
var graphqlHTTP = expressGraphQl.graphqlHTTP;
var buildSchema = graphQl.buildSchema;
var schema = buildSchema(schema_1.schemaDefinition);
var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: firebaseServer_1.rootResolver,
    graphiql: true,
}));
app.listen(4000);
console.log('Running GraphQL API server at http://localhost:4000/graphql');
