import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import Album from './models/Album.js'

dotenv.config()
await connectDB()

const typeDefs = `#graphql
  type Album {
    id: ID!
    artist: String!
    title: String!
    year: Int!
  }

  type Query {
    albums: [Album!]!
    album(id: ID!): Album
  }

  type Mutation {
    deleteAlbum(id: ID!): Album
  }
`

const resolvers = {
  Query: {
    albums: async () => {
      return await Album.find()
    },
    album: async (_, args) => {
      return await Album.findById(args.id)
    },
  },
  Mutation: {
    deleteAlbum: async (_, args) => {
      return await Album.findByIdAndDelete(args.id)
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
})

console.log(`GraphQL server ready at ${url}`)