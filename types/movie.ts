export interface TypeMovieOverview {
  id: number;
  poster: string;
  title: string;
  ratingCount: number;
  releaseDate: string;
  overview: string;
}

export interface TypeMovieDetails {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
