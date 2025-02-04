import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    transactions: [Transaction]
  }

  type Mutation {
    addTransaction(description: String!, amount: Float!, date: String!): Transaction
    deleteTransaction(id: ID!): Transaction
    updateTransaction(id: ID!, description: String!, amount: Float!, date: String!): Transaction
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    date: String!
  }
`;