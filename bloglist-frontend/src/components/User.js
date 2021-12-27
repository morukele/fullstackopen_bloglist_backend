import React from "react";

const User = ({ user }) => {
  if (!user) {
    return null;
  }
  const blogs = user.blogs;
  return (
    <div>
      <h2>{user.name}</h2>

      <div>
        <h2>added blogs</h2>
        {blogs.length !== 0 ? (
          blogs.map((b) => <p key={b.id}>{b.title}</p>)
        ) : (
          <p>no blogs found</p>
        )}
      </div>
    </div>
  );
};

export default User;
