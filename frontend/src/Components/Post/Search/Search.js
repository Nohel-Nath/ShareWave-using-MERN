import React, { useState } from "react";
import "./search.css";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { searchAction } from "../../../Actions/UserActions";
import UserDetails from "../../User/UserDetails/UserDetails";
import Post from "../Post";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const { posts, users, loading, error } = useSelector((state) => state.search);

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(searchAction(searchQuery, searchQuery));
    setSearched(true);
  };

  return (
    <div className="search">
      <form className="searchForm" onSubmit={submitHandler}>
        <input
          type="text"
          value={searchQuery}
          placeholder="Enter Name or Tags"
          required
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button
          type="submit"
          sx={{
            paddingLeft: "1.5vmax",
            paddingRight: "1.5vmax",
            borderRadius: "15px",
            fontDisplay: "underline",
            fontSize: "1.5vmax",
            backgroundColor: "rgb(38, 63, 173)",
            color: "white",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
              borderRadius: "30px",
            },
            "@media screen and (max-width: 600px)": {
              fontSize: "2.5vmax", // Adjust font size for smaller screens
              padding: "1.5vmax", // Adjust padding for smaller screens
              width: "150px",
            },
            "@media screen and (min-width: 601px) and (max-width: 900px)": {
              fontSize: "2.5vmax", // Adjust font size for smaller screens
            },
          }}
        >
          Search
        </Button>

        <div className="searchResults">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              {searched && users && users.length > 0 && (
                <>
                  {users.map((user) => (
                    <UserDetails
                      key={user._id}
                      userId={user._id}
                      name={user.name}
                      avatar={user.avatar ? user.avatar.url : null}
                    />
                  ))}
                </>
              )}

              {searched && posts && posts.length > 0 && (
                <>
                  {posts.map((post) => (
                    <div key={post._id}>
                      <Post
                        key={post._id}
                        postId={post._id}
                        caption={post.caption}
                        postImage={
                          post.image ? post.image.map((img) => img.url) : null
                        }
                        tags={post.tags ? post.tags : null}
                        location={post.location ? post.location : null}
                        feeling={post.feeling ? post.feeling : null}
                        likes={post.likes}
                        comments={post.comments}
                        ownerImage={post.owner?.avatar?.url}
                        ownerName={post.owner?.name}
                        ownerId={post.owner?._id}
                        createdAt={post.createdAt}
                      />
                    </div>
                  ))}
                </>
              )}

              {searched && users.length === 0 && posts.length === 0 && (
                <Typography variant="body1">No results found.</Typography>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Search;
