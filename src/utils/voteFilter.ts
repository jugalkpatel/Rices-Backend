import { Vote, Type, Post } from "@prisma/client";
import { NextFunction } from "express";
// import { Vote } from "../graphql/vote/vote.types";
// import { Post } from "../graphql/post/post.types";
// import { NexusGenFieldTypes } from "../../nexus-typegen";

// type Vote = Pick<NexusGenFieldTypes, "Vote">;

// type Post = Pick<typeof Post, "">;

type CustomPost = Post & {
  votes: Array<Vote>;
};

function voteCount(votes: Array<Partial<Vote>>) {
  const upvotes = votes.filter(({ type }) => type === "UPVOTE");

  const downvotes = votes.filter(({ type }) => type === "DOWNVOTE");

  return upvotes.length - downvotes.length;
}

// type Custom = Pick<Post, "Post">;

function filterPosts(posts: Array<CustomPost>) {
  const newPosts = posts.sort((current, next) => {
    const currentVotes = voteCount(current.votes);

    const nextVotes = voteCount(next.votes);

    if (currentVotes > nextVotes) {
      return -1;
    }

    if (currentVotes < nextVotes) {
      return 1;
    }

    return 0;
  });

  return newPosts;
}

export { voteCount, filterPosts };

// function topFilter(posts: Array<Post>): Array<Post> {
//   //   const postsForSort = [...posts];

//   const postsForSort = posts.map(({ Post }) => {
//     return Post;
//   });

//   const filteredPosts = postsForSort.sort((current, next) => {
//     if (voteCount(current.) > voteCount(next.votes)) {
//       return -1;
//     }
//     if (voteCount(current.votes) < voteCount(next.votes)) {
//       return 1;
//     }
//     return 0;
//   });

//   return filteredPosts;
// }
