import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

let albums = [
  { id: '1', artist: 'Toto', title: 'Toto IV', year: 1982 },
  { id: '2', artist: 'Adele', title: '25', year: 2015 },
  { id: '3', artist: 'Drake', title: 'Views', year: 2016 },
]

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
    albums: () => albums,
    album: (_, args) => albums.find((album) => album.id === args.id),
  },
  Mutation: {
    deleteAlbum: (_, args) => {
      const index = albums.findIndex((album) => album.id === args.id)

      if (index === -1) return null

      const deletedAlbum = albums[index]
      albums.splice(index, 1)

      return deletedAlbum
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