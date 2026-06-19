import TrackScroll from './TrackScroll';

const HomeSection = ({ sections, playTrack, isFavorite, toggleFavorite, currentTrack }) => {
    const titles = {
        recommended: 'Рекомендуемые',
        popular: 'Популярные',
        albums: 'Альбомы',
        premium: 'Премиум'
    };

    return (
        <>
            {['recommended', 'popular', 'albums', 'premium'].map(key => {
                const section = sections[key];
                return (
                    <div key={key}>
                        <h3 className="section-title">{titles[key]}</h3>
                        {section.loading && <p className="loading-text">Загрузка...</p>}
                        {!section.loading && section.tracks.length > 0 && (
                            <TrackScroll
                                tracks={section.tracks}
                                playTrack={playTrack}
                                isFavorite={isFavorite}
                                toggleFavorite={toggleFavorite}
                                currentTrack={currentTrack}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
}
export default HomeSection