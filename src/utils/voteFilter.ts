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

  const lastPostId = filteredPosts[filteredPosts.length - 1].id;

  console.log({ lastPostId });

  if (take > filteredPosts.length) {
    return { posts: filteredPosts, cursorId: "" };
  }

  if (!cursorId) {
    const posts = filteredPosts.slice(0, take);

    const newCursorId = posts[posts.length - 1].id;

    posts.forEach(({ id }) => {
      console.log({ id });
    });

    console.log({ newCursorId });

    console.log("--------------------");

    return { posts, cursorId: newCursorId };
  }

  const cursorIndex = filteredPosts.findIndex(({ id }) => id === cursorId);

  if (cursorIndex + 1 + take > filteredPosts.length) {
    return {
      posts: filteredPosts.slice(cursorIndex + 1),
      cursorId: "",
    };
  }

  const posts = filteredPosts.slice(cursorIndex + 1, cursorIndex + take + 1);

  const newCursorId = posts[posts.length - 1].id;

  if (newCursorId === lastPostId) {
    return { posts, cursorId: "" };
  }

  return { posts, cursorId: newCursorId };
}

export { voteCount, filterPosts, filterPostsByVote };
