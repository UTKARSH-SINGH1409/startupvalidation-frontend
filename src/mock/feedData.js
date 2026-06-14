// src/mock/feedData.js
// Mock data and helper functions for the Feed feature using localStorage

const INITIAL_FEED = [
  {
    id: "post_1",
    authorName: "Sarah Connor",
    authorId: "user_sarah",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    idea: {
      title: "AI-Powered Threat Detection API",
      industry: "Cybersecurity",
      problem: "Small businesses cannot afford dedicated security teams, leaving them vulnerable to ransomware.",
      solution: "A drop-in API that monitors web traffic anomalies using ML and blocks suspicious IPs automatically.",
    },
    ratings: [{ userId: "user_john", score: 5 }, { userId: "user_alice", score: 4 }],
    comments: [
      { id: "c1", authorName: "John Doe", text: "Brilliant. Have you thought about integrating with Cloudflare?", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    ],
  },
  {
    id: "post_2",
    authorName: "Alice Wonderland",
    authorId: "user_alice",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    idea: {
      title: "Eco-Friendly Packaging Marketplace",
      industry: "E-Commerce",
      problem: "DTC brands struggle to find affordable, sustainable packaging options in low MOQs.",
      solution: "A B2B marketplace connecting eco-friendly suppliers with DTC brands, pooling orders to lower minimum order quantities.",
    },
    ratings: [{ userId: "user_sarah", score: 4 }],
    comments: [],
  },
];

// Initialize local storage if empty
export const initFeedData = () => {
  if (!localStorage.getItem("feed_posts")) {
    localStorage.setItem("feed_posts", JSON.stringify(INITIAL_FEED));
  }
  if (!localStorage.getItem("feed_following")) {
    localStorage.setItem("feed_following", JSON.stringify([])); // Array of authorIds
  }
};

// Get the current logged-in user id (mocked based on email)
export const getCurrentUserId = () => {
  const email = localStorage.getItem("email");
  return email ? `user_${email}` : "user_guest";
};

// Get the current logged-in user name
export const getCurrentUserName = () => {
  return localStorage.getItem("userName") || "Founder";
};

// Fetch all posts
export const getFeedPosts = () => {
  initFeedData();
  const data = localStorage.getItem("feed_posts");
  return data ? JSON.parse(data) : [];
};

// Add a new post
export const addPost = (idea) => {
  const posts = getFeedPosts();
  const newPost = {
    id: `post_${Date.now()}`,
    authorName: getCurrentUserName(),
    authorId: getCurrentUserId(),
    timestamp: new Date().toISOString(),
    idea,
    ratings: [],
    comments: [],
  };
  posts.unshift(newPost);
  localStorage.setItem("feed_posts", JSON.stringify(posts));
  return newPost;
};

// Add a comment
export const addComment = (postId, text) => {
  const posts = getFeedPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);
  if (postIndex > -1) {
    posts[postIndex].comments.push({
      id: `c_${Date.now()}`,
      authorName: getCurrentUserName(),
      text,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("feed_posts", JSON.stringify(posts));
  }
};

// Rate a post (1 to 5)
export const ratePost = (postId, score) => {
  const posts = getFeedPosts();
  const userId = getCurrentUserId();
  const postIndex = posts.findIndex((p) => p.id === postId);
  
  if (postIndex > -1) {
    const existingRatingIndex = posts[postIndex].ratings.findIndex(r => r.userId === userId);
    if (existingRatingIndex > -1) {
      posts[postIndex].ratings[existingRatingIndex].score = score;
    } else {
      posts[postIndex].ratings.push({ userId, score });
    }
    localStorage.setItem("feed_posts", JSON.stringify(posts));
  }
};

// Get followings list
export const getFollowing = () => {
  initFeedData();
  const data = localStorage.getItem("feed_following");
  return data ? JSON.parse(data) : [];
};

// Toggle follow
export const toggleFollow = (authorId) => {
  let following = getFollowing();
  if (following.includes(authorId)) {
    following = following.filter((id) => id !== authorId);
  } else {
    following.push(authorId);
  }
  localStorage.setItem("feed_following", JSON.stringify(following));
  return following;
};
