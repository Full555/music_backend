import TrackScroll from './TrackScroll';

const SearchSection = ({
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    handleSearchSubmit,
    resetFilters,
    loadingSearch,
    searchTracks,
    playTrack,
    isFavorite,
    toggleFavorite,
    currentTrack
}) => {
    return (
        <>
            <form className="search-container" onSubmit={handleSearchSubmit}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    placeholder="Артисты, треки..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="button" className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                    <i className="fa-solid fa-sliders-h"></i>
                </button>
            </form>

            {showFilters && (
                <div className="filters-panel">
                    <select
                        className="filter-select"
                        value={filters.genre}
                        onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                    >
                        <option value="">Все жанры</option>
                        <option value="10">Музыка</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Артист"
                        className="filter-input"
                        value={filters.artist}
                        onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
                    />
                    <div className="year-range">
                        <input
                            type="number"
                            placeholder="Год от"
                            className="filter-input-small"
                            value={filters.yearFrom}
                            onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
                        />
                        <span>—</span>
                        <input
                            type="number"
                            placeholder="Год до"
                            className="filter-input-small"
                            value={filters.yearTo}
                            onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
                        />
                    </div>
                    <div className="filter-buttons">
                        <button className="filter-apply" onClick={handleSearchSubmit}>Применить</button>
                        <button className="filter-reset" onClick={resetFilters}>Сбросить</button>
                    </div>
                </div>
            )}

            {loadingSearch && <p className="loading-text">Поиск...</p>}
            {!loadingSearch && searchTracks.length > 0 && (
                <TrackScroll
                    tracks={searchTracks}
                    playTrack={playTrack}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                    currentTrack={currentTrack}
                />
            )}
            {!loadingSearch && searchTracks.length === 0 && (searchQuery.trim() || filters.artist) && (
                <p className="loading-text">Ничего не найдено</p>
            )}
        </>
    );
}

export default SearchSection