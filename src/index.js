import { GraphQLServer } from "graphql-yoga";




// Scalar Types-- String, Boolean, Int, Float (numbers w/decimals), ID(unique identifiers)

//Demo User Date
const users = [
  {
    id: "1",
    name: "Sara",
    email: "saraha@example.com",
    age: 53,
  },
  {
    id: "2",
    name: "Matt",
    email: "matt@example.com",
  },
  {
    id: "3",
    name: "Bob",
    email: "bob@example.com",
    age: 22,
  },
];

const posts = [
  {
    id: "1",
    title: "first post third idea",
    body: "This is my first post, but I cant wait to write a second one",
    published: true,
    author: '1'
  },
  {
    id: "2",
    title: "second post apple",
    body: "This is my second post",
    published: true,
    author: '1'
  },
  {
    id: "3",
    title: "third post",
    body: "This is my third post",
    published: false,
    author: '2'
  },
];

const comments =[
  {
    id:"10",
    text: 'comment1',
    author: '3',
    post: '1'
  },
  {
    id:"11",
    text: 'comment2',
    author: '3',
    post: '1'
  },
  {
    id:"12",
    text: 'comment3',
    author: '2',
    post: '2'
  },
  {
    id:"13",
    text: 'comment4',
    author: '1',
    post: '1'
  },
]



//Type Definitions (schema)- describes data structures
//2 Direction Relationships - 
//      Given a post we can access author through author property
//      Given an author I can access posts 
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
        
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments:[Comment!]!
    }

    
    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User! 
        comments: [Comment!]!
    }

    type Comment{
      id: ID!
      text: String!
      author: User!
      post: Post!
    }

`;
//Resolvers- functions that are actually run when various operations are performed

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parent, args, ctx, info){
      return comments;
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        let isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        let isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
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
  Post: {
    author(parent, args, ctx, info){
      return users.find((user)=> {
        return user.id === parent.author
      })

    },
    comments(parent, args, ctx, info){
      return comments.filter((comment)=>{
        return comment.post === parent.id
      })
    }
  },
  Comment:{
    author(parent, args, ctx, info){
      return users.find((user)=>{
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info){
      return posts.find((post)=>{
        return post.id === parent.post
      })
    }

  },
  User:{
    posts(parent, args, ctx, info){
      return posts.filter((post) =>{
        return post.author === parent.id

      })
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment)=>{
        return comment.author === parent.id
      })
    }
  }
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
