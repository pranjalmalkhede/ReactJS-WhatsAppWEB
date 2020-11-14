import React from "react";
import SearchIcon from "@material-ui/icons/Search";

const Search = ({ search, setSearch }) => {
  return (
    <div className="search">
      <div className="search__input">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search or start a new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
