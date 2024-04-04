export interface TypeGenreMMovies {
  id: number;
  name: string;
}

export interface TypeMovieCategory {
  category_id: number;
  category_name: string;
  idMovieDb: number;
  isFavorite?: boolean;
}
