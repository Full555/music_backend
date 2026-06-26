import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeSection from './components/HomeSection';
import SearchSection from './components/SearchSection';
import FavoritesSection from './components/FavoritesSection';
import ProfileSection from './components/ProfileSection';
import PlayerBar from './components/PlayerBar';
import FullPlayer from './components/FullPlayer';
import MiniMenu from './components/MiniMenu';
import PlaylistSelectModal from './components/PlaylistSelectModal';
import CreatePlaylistModal from './components/CreatePlaylistModal';
import ConfirmModal from './components/ConfirmModal';
import PlaylistView from './components/PlaylistView';



const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const [sections, setSections] = useState({
    recommended: { tracks: [], loading: false, loaded: false },
    popular: { tracks: [], loading: false, loaded: false },
    albums: { tracks: [], loading: false, loaded: false },
    premium: { tracks: [], loading: false, loaded: false }
  });

  const [searchTracks, setSearchTracks] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filters, setFilters] = useState({ genre: '', yearFrom: '', yearTo: '', artist: '' });
  const [showFilters, setShowFilters] = useState(false);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const rafIdRef = useRef(null);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [playMode, setPlayMode] = useState('normal');

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('eleve_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('eleve_playlists');
    return saved ? JSON.parse(saved) : [];
  });

  const [profileLogged, setProfileLogged] = useState(false);
  const [listenCount, setListenCount] = useState(() => parseInt(localStorage.getItem('eleve_listen_count') || '0'));

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [viewedPlaylist, setViewedPlaylist] = useState(null);
  const [showPlaylistSelect, setShowPlaylistSelect] = useState(false);
  const [trackToAdd, setTrackToAdd] = useState(null);
  const [showMiniMenu, setShowMiniMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [playlistRemoveTarget, setPlaylistRemoveTarget] = useState(null);

  // Telegram WebApp theme
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      const applyTheme = (theme) => {
        const root = document.documentElement.style;
        if (theme.bg_color) root.setProperty('--bg-color', theme.bg_color);
        if (theme.secondary_bg_color) {
          root.setProperty('--secondary-bg', theme.secondary_bg_color);
          root.setProperty('--card-bg', theme.secondary_bg_color + '99');
          root.setProperty('--glass-bg', theme.secondary_bg_color + '80');
        }
        if (theme.text_color) root.setProperty('--text-color', theme.text_color);
        if (theme.hint_color) root.setProperty('--hint-color', theme.hint_color);
        if (theme.button_color) root.setProperty('--btn-color', theme.button_color);
        if (theme.button_text_color) root.setProperty('--btn-text', theme.button_text_color);
      };
      applyTheme(tg.themeParams);
      tg.onEvent('themeChanged', () => applyTheme(tg.themeParams));
    }
  }, []);

  const updateProgress = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      rafIdRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  const getCurrentPlaylist = useCallback(() => {
    if (activeTab === 'search' && searchTracks.length > 0) return searchTracks;
    if (activeTab === 'favorites') return favorites;
    if (viewedPlaylist) return viewedPlaylist.tracks;
    return sections.recommended.tracks.length > 0 ? sections.recommended.tracks : [];
  }, [activeTab, searchTracks, favorites, sections, viewedPlaylist]);

  const handleTrackEnd = useCallback(() => {
    if (playMode === 'repeat') {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      return;
    }

    const playlist = getCurrentPlaylist();
    if (!currentTrack || playlist.length === 0) return;

    let currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) currentIndex = 0;

    if (playMode === 'shuffle') {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      const nextTrack = playlist[randomIndex];
      if (nextTrack) playTrack(nextTrack);
    } else {
      const nextIndex = (currentIndex + 1) % playlist.length;
      const nextTrack = playlist[nextIndex];
      if (nextTrack) playTrack(nextTrack);
    }
  }, [currentTrack, playMode, getCurrentPlaylist]);

  useEffect(() => {
    const audio = audioRef.current;
    const onPlay = () => {
      setIsPlaying(true);
      rafIdRef.current = requestAnimationFrame(updateProgress);
    };
    const onPause = () => {
      setIsPlaying(false);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
    const onEnded = () => {
      setIsPlaying(false);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      handleTrackEnd();
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateProgress, handleTrackEnd]);

  const fetchSection = useCallback(async (sectionKey, query) => {
    if (sections[sectionKey].loaded || sections[sectionKey].loading) return;
    setSections(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], loading: true } }));
    try {
      const params = new URLSearchParams({ term: query, media: 'music', limit: 8 });
      const res = await fetch(`${ITUNES_SEARCH_URL}?${params}`);
      const data = await res.json();
      const tracks = data.results.map(item => ({
        id: item.trackId,
        title: item.trackName,
        artist: item.artistName,
        thumbnail: item.artworkUrl100?.replace('100x100bb', '400x400bb') || '',
        previewUrl: item.previewUrl,
      })).filter(t => t.previewUrl);
      setSections(prev => ({
        ...prev,
        [sectionKey]: { tracks, loading: false, loaded: true }
      }));
    } catch (e) {
      setSections(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], loading: false } }));
    }
  }, [sections]);

  useEffect(() => {
    if (activeTab !== 'home' && activeTab !== 'search') return;
    fetchSection('recommended', 'top hits');
    fetchSection('popular', 'popular');
    fetchSection('albums', 'album');
    fetchSection('premium', 'chill');
  }, [activeTab, fetchSection]);

  const performSearch = useCallback(async (query, filtersObj = {}) => {
    if (!query.trim() && !filtersObj.artist) { setSearchTracks([]); return; }
    setLoadingSearch(true);
    try {
      const term = [query, filtersObj.artist].filter(Boolean).join(' ');
      const params = new URLSearchParams({ term, media: 'music', limit: 20 });
      const res = await fetch(`${ITUNES_SEARCH_URL}?${params}`);
      const data = await res.json();
      const tracks = data.results.map(item => ({
        id: item.trackId,
        title: item.trackName,
        artist: item.artistName,
        thumbnail: item.artworkUrl100?.replace('100x100bb', '400x400bb') || '',
        previewUrl: item.previewUrl,
      })).filter(t => t.previewUrl);
      setSearchTracks(tracks);
    } catch (e) { } finally { setLoadingSearch(false); }
  }, []);

  const handleSearchSubmit = (e) => { e.preventDefault(); performSearch(searchQuery, filters); };
  const resetFilters = () => { setFilters({ genre: '', yearFrom: '', yearTo: '', artist: '' }); if (searchQuery.trim()) performSearch(searchQuery, {}); };

  const playTrack = (track) => {
    if (!track?.previewUrl) return;

    if (!currentTrack || currentTrack.id !== track.id) {
      const newCount = listenCount + 1;
      setListenCount(newCount);
      localStorage.setItem('eleve_listen_count', newCount);
    }

    const audio = audioRef.current;
    if (currentTrack?.id === track.id) {
      isPlaying ? audio.pause() : audio.play().catch(console.error);
      return;
    }

    audio.pause();
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    audio.src = track.previewUrl;
    audio.play().catch(console.error);
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  };

  const playAudio = () => audioRef.current.play().catch(console.error);
  const pauseAudio = () => audioRef.current.pause();

  const handlePrev = useCallback(() => {
    const playlist = getCurrentPlaylist();
    if (!currentTrack || playlist.length === 0) return;
    let idx = playlist.findIndex(t => t.id === currentTrack.id);
    if (idx === -1) idx = 0;
    const newIdx = playMode === 'shuffle' ? Math.floor(Math.random() * playlist.length) : idx > 0 ? idx - 1 : playlist.length - 1;
    playTrack(playlist[newIdx]);
  }, [currentTrack, getCurrentPlaylist, playMode]);

  const handleNext = useCallback(() => {
    const playlist = getCurrentPlaylist();
    if (!currentTrack || playlist.length === 0) return;
    let idx = playlist.findIndex(t => t.id === currentTrack.id);
    if (idx === -1) idx = 0;
    const newIdx = playMode === 'shuffle' ? Math.floor(Math.random() * playlist.length) : idx < playlist.length - 1 ? idx + 1 : 0;
    playTrack(playlist[newIdx]);
  }, [currentTrack, getCurrentPlaylist, playMode]);

  const togglePlayMode = () => setPlayMode(prev => prev === 'normal' ? 'repeat' : prev === 'repeat' ? 'shuffle' : 'normal');

  const openCreatePlaylistModal = () => { setNewPlaylistName(''); setShowCreateModal(true); };
  const confirmCreatePlaylist = () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    const updated = [...playlists, { id: Date.now(), name, tracks: [] }];
    setPlaylists(updated);
    localStorage.setItem('eleve_playlists', JSON.stringify(updated));
    setShowCreateModal(false);
  };

  const isTrackInAnyPlaylist = (trackId) => playlists.some(pl => pl.tracks.some(t => t.id === trackId));

  const addToPlaylist = (playlistId, track) => {
    const updated = playlists.map(pl =>
      pl.id === playlistId && !pl.tracks.find(t => t.id === track.id)
        ? { ...pl, tracks: [...pl.tracks, track] }
        : pl
    );
    setPlaylists(updated);
    localStorage.setItem('eleve_playlists', JSON.stringify(updated));
    setShowPlaylistSelect(false);
    setTrackToAdd(null);
  };

  const removeFromPlaylist = (playlistId, trackId) => {
    const updated = playlists.map(pl =>
      pl.id === playlistId
        ? { ...pl, tracks: pl.tracks.filter(t => t.id !== trackId) }
        : pl
    );
    setPlaylists(updated);
    localStorage.setItem('eleve_playlists', JSON.stringify(updated));
    if (viewedPlaylist?.id === playlistId) {
      setViewedPlaylist(updated.find(p => p.id === playlistId) || null);
    }
    setConfirmDelete(null);
    setPlaylistRemoveTarget(null);
  };

  const handleDeletePlaylist = (playlistId) => {
    const updated = playlists.filter(pl => pl.id !== playlistId);
    setPlaylists(updated);
    localStorage.setItem('eleve_playlists', JSON.stringify(updated));
    setViewedPlaylist(null);
    setConfirmDelete(null);
  };

  const openAddToPlaylist = (track) => {
    if (playlists.length === 0) {
      openCreatePlaylistModal();
      return;
    }
    setTrackToAdd(track);
    setPlaylistRemoveTarget(null);
    setShowPlaylistSelect(true);
  };

  const openRemoveFromPlaylist = (trackId) => {
    const pls = playlists.filter(pl => pl.tracks.some(t => t.id === trackId));
    if (pls.length === 0) return;
    setPlaylistRemoveTarget(trackId);
    setTrackToAdd(null);
    setShowPlaylistSelect(true);
  };

  const handleMiniMenuAction = (action) => {
    setShowMiniMenu(false);
    if (action === 'add') openAddToPlaylist(currentTrack);
    else if (action === 'remove') openRemoveFromPlaylist(currentTrack.id);
    else if (action === 'mode') togglePlayMode();
  };

  const toggleFavorite = (track) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === track.id);
      return exists ? prev.filter(f => f.id !== track.id) : [...prev, track];
    });
  };

  useEffect(() => { localStorage.setItem('eleve_favorites', JSON.stringify(favorites)); }, [favorites]);

  const isFavorite = (trackId) => favorites.some(f => f.id === trackId);
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const seekTo = (e, containerRef) => {
    if (!containerRef || !duration) return;
    const rect = containerRef.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    if (audioRef.current && !isNaN(newTime) && newTime >= 0 && newTime <= duration) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Рендер домашних секций для использования в экране поиска при пустом запросе
  const renderHomeSections = () => (
    <HomeSection
      sections={sections}
      playTrack={playTrack}
      isFavorite={isFavorite}
      toggleFavorite={toggleFavorite}
      currentTrack={currentTrack}
    />
  );

  return (
    <div className="app-container">
      <Header />

      <main>
        <div className={`screen ${activeTab === 'home' ? 'active' : ''}`}>
          <h2>Главная</h2>
          <p className="subtitle">Твой персональный музыкальный мир в Telegram.</p>
          {renderHomeSections()}
        </div>

        <div className={`screen ${activeTab === 'search' ? 'active' : ''}`}>
          <h2>Поиск</h2>
          <p className="subtitle">Найди любимые треки, альбомы или артистов.</p>
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            handleSearchSubmit={handleSearchSubmit}
            resetFilters={resetFilters}
            loadingSearch={loadingSearch}
            searchTracks={searchTracks}
            playTrack={playTrack}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            currentTrack={currentTrack}
          />
          {!searchQuery.trim() && !filters.artist && renderHomeSections()}
        </div>

        <div className={`screen ${activeTab === 'favorites' ? 'active' : ''}`}>
          <h2>Избранное</h2>
          <p className="subtitle">Музыка, которую ты сохранил.</p>
          <FavoritesSection
            favorites={favorites}
            playTrack={playTrack}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            currentTrack={currentTrack}
          />
        </div>

        <div className={`screen ${activeTab === 'profile' ? 'active' : ''}`}>
          <ProfileSection
            profileLogged={profileLogged}
            setProfileLogged={setProfileLogged}
            listenCount={listenCount}
            playlists={playlists}
            setViewedPlaylist={setViewedPlaylist}
            openCreatePlaylistModal={openCreatePlaylistModal}
            setConfirmDelete={setConfirmDelete}
          />
        </div>
      </main>

      {currentTrack && (
        <PlayerBar
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          playAudio={playAudio}
          pauseAudio={pauseAudio}
          handlePrev={handlePrev}
          handleNext={handleNext}
          currentTime={currentTime}
          duration={duration}
          progressPercent={progressPercent}
          formatTime={formatTime}
          seekTo={seekTo}
          isTrackInAnyPlaylist={isTrackInAnyPlaylist}
          openAddToPlaylist={openAddToPlaylist}
          setShowMiniMenu={setShowMiniMenu}
          playMode={playMode}
          togglePlayMode={togglePlayMode}
          setShowFullPlayer={setShowFullPlayer}
        />
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} setShowFullPlayer={setShowFullPlayer} />

      {showMiniMenu && (
        <MiniMenu
          handleMiniMenuAction={handleMiniMenuAction}
          playMode={playMode}
          togglePlayMode={togglePlayMode}
          isTrackInAnyPlaylist={isTrackInAnyPlaylist}
          currentTrack={currentTrack}
          setShowMiniMenu={setShowMiniMenu}
        />
      )}

      {showFullPlayer && currentTrack && (
        <FullPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          playAudio={playAudio}
          pauseAudio={pauseAudio}
          handlePrev={handlePrev}
          handleNext={handleNext}
          currentTime={currentTime}
          duration={duration}
          progressPercent={progressPercent}
          formatTime={formatTime}
          seekTo={seekTo}
          playMode={playMode}
          togglePlayMode={togglePlayMode}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          openAddToPlaylist={openAddToPlaylist}
          setShowFullPlayer={setShowFullPlayer}
        />
      )}

      {showPlaylistSelect && (
        <PlaylistSelectModal
          playlists={playlists}
          addToPlaylist={addToPlaylist}
          setShowPlaylistSelect={setShowPlaylistSelect}
          trackToAdd={trackToAdd}
        />
      )}

      {showCreateModal && (
        <CreatePlaylistModal
          setShowCreateModal={setShowCreateModal}
          newPlaylistName={newPlaylistName}
          setNewPlaylistName={setNewPlaylistName}
          confirmCreatePlaylist={confirmCreatePlaylist}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          confirmDelete={confirmDelete}
          setConfirmDelete={setConfirmDelete}
          handleDeletePlaylist={handleDeletePlaylist}
          removeFromPlaylist={removeFromPlaylist}
        />
      )}

      {viewedPlaylist && (
        <PlaylistView
          viewedPlaylist={viewedPlaylist}
          setViewedPlaylist={setViewedPlaylist}
          playTrack={playTrack}
          currentTrack={currentTrack}
          setConfirmDelete={setConfirmDelete}
        />
      )}
    </div>
  );
}

export default App;