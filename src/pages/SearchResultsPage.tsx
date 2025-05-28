import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { search } from '../api/lastfm';
import { Artist } from '../models/artist';
import { Track } from '../models/track';
import SearchForm from '../components/SearchForm';
import Footer from '../components/Footer';


const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchResults = async () => {
    try {
      setLoading(true);
      const [artistResults, trackResults] = await Promise.all([
        search(query, 'artist', 8) as Promise<Artist[]>,
        search(query, 'track', 10) as Promise<Track[]>
      ]);
      
      setArtists(artistResults);
      setTracks(trackResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (query) fetchResults();
}, [query]);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="search-results-page">
      <h1 className="search-title">Search results for "{query}"</h1>
      
      <div className="search-container">
        <SearchForm onSearch={handleSearch} />
      </div>

      <div className="toc">
        <h2 className="toc-title">Top Results</h2>
        <div className="toc-links">
          <a href="#artists">Artists</a>
          <a href="#tracks">Tracks</a>
        </div>
      </div>

      <section id="artists" className="artists-section">
        <div className="section-header">
            <h2 className="section-title-red">Artists</h2>
        </div>
        <div className="artists-container">
        
            {artists.length > 0 ? (
            <>
                {/* Первый ряд артистов */}
                <div className="artists-row">
                {artists.slice(0, 4).map(artist => (
                    <div key={artist.id} className="artist-card">
                    <div className="artist-image-container">
                        {artist.image ? (
                        <img src={artist.image} alt={artist.name} className="artist-image" />
                        ) : (
                        <div className="image-placeholder"></div>
                        )}
                        <div className="artist-info-overlay">
                        <h3 className="artist-name">{artist.name}</h3>
                        <p className="artist-listeners">{artist.listeners || 0} listeners</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Второй ряд артистов */}
                {artists.length > 4 && (
                <div className="artists-row">
                    {artists.slice(4, 8).map(artist => (
                    <div key={artist.id} className="artist-card">
                        <div className="artist-image-container">
                        {artist.image ? (
                            <img src={artist.image} alt={artist.name} className="artist-image" />
                        ) : (
                            <div className="image-placeholder"></div>
                        )}
                        <div className="artist-info-overlay">
                            <h3 className="artist-name">{artist.name}</h3>
                            <p className="artist-listeners">{artist.listeners || 0} listeners</p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </>
            ) : (
            <div className="no-artists">No artists found</div>
            )}
          </div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="tracks-section">
      <div className="section-header">
        <h2 className="section-title-red">Tracks</h2>
      </div>
      <div className="search-tracks-container">
            {tracks.length > 0 ? (
            tracks.map((track, index) => (
                <React.Fragment key={track.id}>
                <div className="search-track-row">
                    <input type="checkbox" className="search-track-checkbox" />
                    <img 
                    src={track.image || 'https://via.placeholder.com/40'} 
                    alt={track.name} 
                    className="search-track-img" 
                    />
                    <div className="search-track-name">{track.name}</div>
                    <div className="search-track-artist">{track.artist}</div>
                    {track.duration && (
                    <div className="search-track-duration">{track.duration}</div>
                    )}
                </div>
                {index < tracks.length - 1 && <div className="track-divider" />}
                </React.Fragment>
            ))
            ) : (
            <div className="search-no-tracks">No tracks found</div>
            )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;