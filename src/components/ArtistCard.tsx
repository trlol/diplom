import React from 'react';
import { Artist } from '../models/artist';

interface Props {
  artist: Artist;
}

const ArtistCard: React.FC<Props> = ({ artist }) => {
  return (
    <div className="artist-card">
      <div className="artist-avatar">
        {artist.image ? (
          <img src={artist.image} alt={artist.name} />
        ) : (
          <div className="avatar-placeholder">{artist.name.charAt(0)}</div>
        )}
      </div>
      <div className="artist-info">
        <h3 className="artist-name">{artist.name}</h3>
        <p className="artist-genres">{artist.genres?.join(' • ') || 'Various genres'}</p>
      </div>
    </div>
  );
};

export default ArtistCard;