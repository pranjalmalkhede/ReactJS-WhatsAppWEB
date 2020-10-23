import React from 'react'

const Search=({ search, setSearch })=> {
    return (
        <div className="search">
            <input
                type="text"
                placeholder="Search or start a new chat"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    )
}

export default Search