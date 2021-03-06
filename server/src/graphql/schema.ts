import { makeExecutableSchema } from "graphql-tools";
import { merge } from "lodash";
import Comments from "./comments/typeDefs";
import { resolvers as commentsResolver } from "./comments/resolvers";
import User from "./user/typeDefs";

import { resolvers as userResolvers } from "./user/resolvers";
import datingText from "./datingText/typeDefs";
import { resolvers as datingTextResolvers } from "./datingText/resolvers";
import { gql } from "apollo-server-express";
import { scalarResolverMap } from "./scalarTypes";
import {
  typeDefs as ScalarTypeDef,
  resolvers as ScalarResolvers,
} from "graphql-scalars";
const Query = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  #   type Subscription {
  #     _empty: String
  #   }
`;
const typeDefs = [...ScalarTypeDef, User, Comments, datingText, Query];
const resolvers = merge(
  ScalarResolvers,
  userResolvers,
  commentsResolver,
  datingTextResolvers,
  scalarResolverMap
);

export const schema = makeExecutableSchema({ typeDefs, resolvers });
