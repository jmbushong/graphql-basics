import uuidv4 from "uuid/v4";

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email);
  
        if (emailTaken) {
          throw new Error("Email taken");
        }
  
        const user = {
          id: uuidv4(),
          ...args.data,
        };
  
        db.users.push(user);
  
        return user;
      },
      deleteComment(parent, args, { db }, info){
        const commentIndex= db.comments.findIndex((comment)=> comment.id === args.id)
        if(commentIndex === -1){
          throw new Error("Comment not found")
        }
  
        const deletedComment= db.comments.splice(commentIndex, 1)
  
        return deletedComment[0];
      },
      deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id);
  
        if (postIndex === -1) {
          throw new Error("Post not found");
        }
  
        //delete post
        //returns array of objects (in this case just one)
        const deletedPosts = db.posts.splice(postIndex, 1);
  
        //remove all associated comments
        db.comments = db.comments.filter((comment) => comment.post !== args.id);
  
        return deletedPosts[0];
      },
  
      deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id);
  
        if (userIndex === -1) {
          throw new Error("User not found");
        }
        //delete user
        //returns array of objects --in this case just one
        const deletedUsers = db.users.splice(userIndex, 1);
  
        //remove all associated posts & comments
        //only keeping posts that do not belong to the user
        db.posts = db.posts.filter((post) => {
          const match = post.author === args.id;
  
          //if the comment belongs to the post that was just deleted--it gets deleted
          if (match) {
            db.comments = comments.filter((comment) => comment.post !== post.id);
          }
          return !match;
        });
  
        //remove all comments that this user has created
        db.comments = db.comments.filter((comment) => comment.author !== args.id);
  
        return deletedUsers[0];
      },
  
      createComment(parent, args, { db }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author);
        const postExists = db.posts.some(
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
          ...args.data,
          // text: args.text,
          // author: args.author,
          // post: args.post
        };
  
        db.comments.push(comment);
  
        return comment;
      },
      createPost(parent, args, { db }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author);
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
  
        db.posts.push(post);
  
        return post;
      },

}

export {Mutation as default}