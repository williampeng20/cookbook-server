"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import expressGraphQl = require('express-graphql');
// import graphQl = require('graphql');
var cors = require("cors");
// import express from 'express';
var express_graphql_1 = require("express-graphql");
var graphql_1 = require("graphql");
var schema_1 = require("./schema");
var firebaseServer_1 = require("./firebaseServer");
// const { graphqlHTTP } = expressGraphQl;
// const { buildSchema } = graphQl;
var schema = graphql_1.buildSchema(schema_1.schemaDefinition);
var app = express();
app.use(cors());
app.use('/graphql', express_graphql_1.graphqlHTTP({
    schema: schema,
    rootValue: firebaseServer_1.rootResolver,
    graphiql: true,
}));
app.listen(4000);
console.log('Running GraphQL API server at http://localhost:4000/graphql');
