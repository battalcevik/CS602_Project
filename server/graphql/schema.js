const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    imageUrl: String
    category: String!
    createdAt: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    role: String!
    createdAt: String
  }

  type OrderItem {
    product: Product
    quantity: Int!
    priceAtOrder: Float!
  }

  type Order {
    _id: ID!
    user: User
    items: [OrderItem]
    totalAmount: Float!
    status: String!
    createdAt: String
  }

  input ProductInput {
    name: String
    description: String
    price: Float
    stock: Int
    category: String
    imageUrl: String
  }

  type Query {
    products(search: String, category: String, minPrice: Float, maxPrice: Float): [Product]
    product(id: ID!): Product
    orders: [Order]
    order(id: ID!): Order
    customers: [User]
    customer(id: ID!): User
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
    updateOrderStatus(id: ID!, status: String!): Order
  }
`;

module.exports = typeDefs;
