import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

//Goal allow clients to create a new comment

// Scalar Types-- String, Boolean, Int, Float (numbers w/decimals), ID(unique identifiers)

//Demo User Date
let users = [
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

let posts = [
  {
    id: "1",
    title: "first post third idea",
    body: "This is my first post, but I cant wait to write a second one",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "second post apple",
    body: "This is my second post",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "third post",
    body: "This is my third post",
    published: false,
    author: "2",
  },
];

let comments = [
  {
    id: "10",
    text: "comment1",
    author: "3",
    post: "1",
  },
  {
    id: "11",
    text: "comment2",
    author: "3",
    post: "1",
  },
  {
    id: "12",
    text: "comment3",
    author: "2",
    post: "2",
  },
  {
    id: "13",
    text: "comment4",
    author: "1",
    post: "1",
  },
];

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

    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      createPost(data: CreatePostInput!): Post!
      createComment(data: CreateCommentInput): Comment! 
    }

    input CreateUserInput{
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput {
      title: String!
      body:String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput{
      text: String!
      author: ID!
      post: ID!
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
    comments(parent, args, ctx, info) {
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info){
      const userIndex = users.findIndex((user)=>user.id === args.id)

      if(userIndex === -1){
        throw new Error ('User not found')

      }

      //delete user
      //returns array of objects --in this case just one
      const deletedUsers = users.splice(userIndex, 1)

      //remove all associated posts & comments
      //only keeping posts that do not belong to the user
      posts= posts.filter((post) => {
        const match = post.author === args.id

        //if the comment belongs to the post that was just deleted--it gets deleted
        if(match){
          comments= comments.filter((comment) => comment.post !== post.id)
        }

        return !match

      })

      //remove all comments that this user has created 
      comments = comment.filter((comment) => comment.author !== args.id)



      return deletedUsers[0]


    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      const postExists = posts.some(
        (post) => post.id === args.data.post && post.published
      );
      if (!userExists) {
        throw new Error("User not found");
      }
      if (!postExists) {
        throw new Error("Post not found");
      }

      const comment = {
        id: uuidv4(),
        ...args.data
        // text: args.text,
        // author: args.author,
        // post: args.post
      };

      comments.push(comment);

      return comment;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        ...args.data,
        // title: args.title,
        // body: args.body,
        // published: args.published,
        // author: args.author
      };

      posts.push(post);

      return post;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
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
