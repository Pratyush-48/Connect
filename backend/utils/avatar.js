const getAvatarUrl = (seed) => {
  const safeSeed = encodeURIComponent(seed || "user");
  return `https://api.dicebear.com/8.x/thumbs/svg?seed=${safeSeed}`;
};

const shouldReplaceAvatar = (value = "") => {
  if (!value || !value.trim()) {
    return true;
  }
  return value.includes("avatar.iran.liara.run");
};

export { getAvatarUrl, shouldReplaceAvatar };
