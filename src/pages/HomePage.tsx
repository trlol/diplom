import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard';
import TrackItem from '../components/TrackItem';
import SearchForm from '../components/SearchForm';
import { getPopularArtists, getPopularTracks } from '../api/lastfm';
import { Artist } from '../models/artist';
import { Track } from '../models/track';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsData, tracksData] = await Promise.all([
          getPopularArtists(12),
          getPopularTracks(18)
        ]);
        setArtists(artistsData);
        setTracks(tracksData);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  // Разбиваем треки на ряды по 3
  const trackRows = [];
  for (let i = 0; i < tracks.length; i += 3) {
    trackRows.push(tracks.slice(i, i + 3));
  }

  return (
    <div className="home-page">
      <header className="main-header">
        <div className="header-content">
          <SearchForm onSearch={handleSearch} />
        </div>
      </header>

      <header className="main-header">
        <div className="header-content">
            <div className="logo">Music</div>
        </div>
      </header>

      {/*секция артистов*/}
      <h1 className="section-title">Hot right now</h1>
      <div className="artists-container">
        <div className="artists-row">
            {artists.slice(0, 6).map((artist, index) => (
                <ArtistCard key={`artist-${artist.id}-${index}`} artist={artist} />
            ))}
        </div>
        <div className="artists-row">
            {artists.slice(6, 12).map((artist, index) => (
                <ArtistCard key={`artist-${artist.id}-${index}`} artist={artist} />
            ))}
        </div>
      </div>

      {/*секция треков*/}
      <section className="tracks-section">
        <h1 className="section-title">Popular tracks</h1>
        <div className="tracks-grid">
          {trackRows.map((row, rowIndex) => (
            <div key={`track-row-${rowIndex}`} className="tracks-row">
                {row.map((track, trackIndex) => (
                <TrackItem key={`track-${track.id}-${trackIndex}`} track={track} />
                ))}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;