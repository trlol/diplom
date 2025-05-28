import { Artist } from '../models/artist';
import { Track } from '../models/track';

const API_KEY = '2f779cf4388f645c997b9ebbb71bfaf3'; 

export const search = async (
  query: string,
  type: 'artist' | 'track',
  limit: number = 8
): Promise<Artist[] | Track[]> => {
  try {
    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=${type}.search&${type}=${encodeURIComponent(query)}&api_key=${API_KEY}&limit=${limit}&format=json`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (type === 'artist') {
      return data.results.artistmatches.artist.map((artist: any): Artist => ({
        id: artist.mbid || Math.random().toString(),
        name: artist.name,
        listeners: artist.listeners,
        image: artist.image.find((img: any) => img.size === 'large')['#text'] || ''
      }));
    } else {
      // Для треков получаем дополнительную информацию через track.getInfo
      const tracks = data.results.trackmatches.track;
      
      // Создаем массив промисов для получения дополнительной информации о каждом треке
      const tracksWithDetails = await Promise.all(
        tracks.map(async (track: any): Promise<Track> => {
          try {
            // Получаем дополнительную информацию о треке
            const trackInfoResponse = await fetch(
              `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(track.artist)}&track=${encodeURIComponent(track.name)}&format=json`
            );
            
            let duration = null;
            if (trackInfoResponse.ok) {
              const trackInfo = await trackInfoResponse.json();
              if (trackInfo.track?.duration) {
                // Конвертируем миллисекунды в минуты:секунды
                const minutes = Math.floor(trackInfo.track.duration / 1000 / 60);
                const seconds = Math.floor((trackInfo.track.duration / 1000) % 60);
                duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
              }
            }
            
            return {
              id: track.mbid || Math.random().toString(),
              name: track.name,
              artist: track.artist,
              image: track.image.find((img: any) => img.size === 'large')['#text'] || '',
              duration: duration
            };
          } catch (error) {
            console.error(`Error fetching track details for ${track.name}:`, error);
            // Возвращаем базовую информацию, если не удалось получить детали
            return {
              id: track.mbid || Math.random().toString(),
              name: track.name,
              artist: track.artist,
              image: track.image.find((img: any) => img.size === 'large')['#text'] || '',
              duration: null
            };
          }
        })
      );
      
      return tracksWithDetails;
    }
  } catch (error) {
    console.error(`Error searching ${type}:`, error);
    return [];
  }
};

export const getPopularArtists = async (limit = 12): Promise<Artist[]> => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&limit=${limit}&format=json`
  );
  const data = await response.json();
  
  return data.artists.artist.map((artist: any): Artist => ({
    id: artist.mbid,
    name: artist.name,
    image: artist.image.find((img: any) => img.size === 'extralarge')['#text'] || 
          artist.image.find((img: any) => img.size === 'large')['#text'] || '',
    genres: artist.tags?.tag?.map((t: any) => t.name) || []
  }));
};

export const getPopularTracks = async (limit = 18): Promise<Track[]> => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&limit=${limit}&format=json`
  );
  const data = await response.json();
  
  return data.tracks.track.map((track: any): Track => ({
    id: track.mbid,
    name: track.name,
    artist: track.artist.name,
    image: track.image.find((img: any) => img.size === 'extralarge')['#text'] || 
          track.image.find((img: any) => img.size === 'large')['#text'] || ''
  }));
};