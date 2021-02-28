const Query = {
    
    users(parent, args, { db }, info) {
        if (!args.query) {
          return db.users;
        }
  
        return db.users.filter((user) => {
          return user.name.toLowerCase().includes(args.query.toLowerCase());
        });
      },
      comments(parent, args, { db }, info) {
        return db.comments;
      },
      posts(parent, args, { db }, info) {
        if (!args.query) {
          return db.posts;
        }
        return db.posts.filter((post) => {
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
}

export { Query as default}