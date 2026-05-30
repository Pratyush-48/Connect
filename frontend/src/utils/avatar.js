const getAvatarUrl = (seed) => {
  const safeSeed = encodeURIComponent(seed || "user");
  return `https://api.dicebear.com/8.x/thumbs/svg?seed=${safeSeed}`;
};

export default getAvatarUrl;
