import TrackScroll from './TrackScroll';

const FavoritesSection = ({ favorites, playTrack, isFavorite, toggleFavorite, currentTrack }) => {
    if (favorites.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--hint-color)' }}>
                <i className="fa-solid fa-heart-crack" style={{ fontSize: '54px', marginBottom: '16px', opacity: 0.6 }}></i>
                <p>Здесь пока тихо</p>
            </div>
        );
    }

    return (
        <TrackScroll
            tracks={favorites}
            playTrack={playTrack}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            currentTrack={currentTrack}
        />
    );
}
export default FavoritesSection