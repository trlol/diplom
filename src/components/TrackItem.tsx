import React from 'react';
import { Track } from '../models/track';

interface Props {
  track: Track;
}

const TrackItem: React.FC<Props> = ({ track }) => {
  return (
    <div className="track-item">
      <img 
        src={track.image || 'https://via.placeholder.com/80'} 
        alt={track.name} 
        className="track-image" 
      />
      <div className="track-info">
        <h3 className="track-name">{track.name}</h3>
        <p className="track-artist">{track.artist}</p>
      </div>
    </div>
  );
};

export default TrackItem;