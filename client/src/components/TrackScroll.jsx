import TrackCard from './TrackCard';

const TrackScroll = ({ tracks, playTrack, isFavorite, toggleFavorite, currentTrack }) => {
    return (
        <div className="horiz-scroll">
            {tracks.map(track => (
                <TrackCard
                    key={track.id}
                    track={track}
                    playTrack={playTrack}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                    currentTrack={currentTrack}
                />
            ))}
        </div>
    );
}

export default TrackScroll