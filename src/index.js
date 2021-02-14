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

const posts=[{
  id:'1',
  title:'first post third idea',
  body:'This is my first post, but I cant wait to write a second one',
  published: true
},{
  id:'2',
  title:'second post apple',
  body:'This is my second post',
  published: true
},{
  id:'3',
  title:'third post',
  body:'This is my third post',
  published: false
}]


//Type Definitions (schema)- describes data structures
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
    posts(parent, args, ctx, info){
      if(!args.query){
        return posts
      }
      return posts.filter((post)=> {
        let isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase()) 
        let isBodyMatch= post.body.toLowerCase().includes(args.query.toLowerCase())
        return (isTitleMatch || isBodyMatch)


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
