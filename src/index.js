import { GraphQLServer } from "graphql-yoga";

// Scalar Types-- String, Boolean, Int, Float (numbers w/decimals), ID(unique identifiers)

//Demo User Date
const users= [{
    id:'1',
    name: 'Sara',
    email: 'saraha@example.com',
    age: 53
}, {
    id: '2',
    name:'Matt',
    email: 'matt@example.com'

},{
    id: '3',
    name: 'Bob',
    email: 'bob@example.com',
    age: 22 

}


]


//Type Definitions (schema)- describes data structures
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        post: Post!
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
    users(parent,args,ctx,info){
        if(!args.query){
          return users
        }

        return users.filter((user)=> {
          return user.name.toLowerCase().includes(args.query.toLowerCase())

        })

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
