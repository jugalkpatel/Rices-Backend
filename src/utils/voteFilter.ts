import { Vote, Post } from "@prisma/client";

type CustomPost = Post & {
  votes: Array<Vote>;
};

function voteCount(votes: Array<Partial<Vote>>) {
  const upvotes = votes.filter(({ type }) => type === "UPVOTE");

  const downvotes = votes.filter(({ type }) => type === "DOWNVOTE");

  return upvotes.length - downvotes.length;
}

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

type FilterPostsByVoteParams = {
  allPosts: Array<CustomPost>;
  cursorId: string | null;
  take: number;
};

function filterPostsByVote({
  allPosts,
  cursorId,
  take,
}: FilterPostsByVoteParams) {
  const filteredPosts = filterPosts(allPosts);

  if (take > filteredPosts.length) {
    return { posts: filteredPosts, cursorId: "" };
  }

  if (!cursorId) {
    const posts = filteredPosts.slice(0, take);

    if (posts.length) {
      const newCursorId = posts[posts.length - 1].id;

      return { posts, cursorId: newCursorId };
    }

    return { posts, cursorId: "" };
  }

  const cursorIndex = filteredPosts.findIndex(({ id }) => id === cursorId);

  if (cursorIndex + 1 + take > filteredPosts.length) {
    return {
      posts: filteredPosts.slice(cursorIndex + 1),
      cursorId: "",
    };
  }

  const posts = filteredPosts.slice(cursorIndex + 1, cursorIndex + take + 1);

  if (posts.length) {
    const newCursorId = posts[posts.length - 1].id;
    const lastPostId = filteredPosts[filteredPosts.length - 1].id;

    if (newCursorId === lastPostId) {
      return { posts, cursorId: "" };
    }

    return { posts, cursorId: newCursorId };
  }

  return { posts, cursorId: "" };
}

export { voteCount, filterPosts, filterPostsByVote };
