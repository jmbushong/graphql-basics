import { GraphQLServer } from "graphql-yoga";

// Scalar Types-- String, Boolean, Int, Float (numbers w/decimals), ID(unique identifiers)

//Type Definitions (schema)- describes data structures
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
     
    }

`;
//Resolvers- functions that are actually run when various operations are performed

const resolvers = {
  Query: {
   
      title(){
            return 'Barbie Doll'
      },
      price(){
            return 5.50

      },
      releaseYear(){
            return 1996
      },
      rating(){
            return 3.5

      },
      inStock(){
            return true
      }
    

  },
};


const server= new GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
})

server.start(()=> {
    console.log('The server is up!')
})