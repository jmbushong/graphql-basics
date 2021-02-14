import { GraphQLServer } from "graphql-yoga";

// Scalar Types-- String, Boolean, Int, Float (numbers w/decimals), ID(unique identifiers)

//Type Definitions (schema)- describes data structures
const typeDefs = `
    type Query {
        add(numbers: [Float!]!): Float
        greeting(name: String, position: String): String!
        me: User!
        post: Post!
        grades:[Int!]!
      
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }


`;
//Resolvers- functions that are actually run when various operations are performed

const resolvers = {
  Query: {
    add(parent, args, ctx, info) {
      if(args.numbers.length === 0){
          return 0
      }
      //[1,5,10,2]
      return args.numbers.reduce((accumulator, currentValue)=> {
          return accumulator + currentValue
      })
    },
    grades(parent, args, ctx, info){
        return [99, 80, 93]

    },
    greeting(parent, args, ctx, info) {
      console.log(args);
      if (args.name && args.position) {
        return `Hello, ${args.name}! You are my favorite ${args.position}.`;
      } else {
        return "Hello!";
      }
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com",
      };
    },
    post() {
      return {
        id: "54321",
        title: "Best Day Ever",
        body: "What a wonderful day!",
        published: true,
      };
    },
  },
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
