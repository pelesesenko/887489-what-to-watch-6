import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import {LIST_SIZE, LoadingStatuses} from '../../constants';
import type Film from '../../types/film';
import {GENERAL_CATALOG_TAB} from '../../constants';
import {RootState} from '../store';

import {mockFilms} from '../mock';
import { ActionTypes, filmsRecieved } from '../extra-actions';

interface ExtraState {
  status: keyof typeof LoadingStatuses,
  error: null,
  promoId: number | null,
  currentGenre: string,
  catalogSize: number
}

const filmsAdapter = createEntityAdapter<Film>();

const initialState: ExtraState & EntityState<Film> = filmsAdapter.getInitialState({
  status: LoadingStatuses.idle,
  error: null,
  promoId: null,
  currentGenre: GENERAL_CATALOG_TAB,
  catalogSize: LIST_SIZE,
});

export const fetchFilms = createAsyncThunk(ActionTypes.fetchFilms,
  async () => {
  // const response = await client.get('/fakeApi/users')
  return mockFilms; //response.data
});
export const fetchFilmById = createAsyncThunk(ActionTypes.fetchFilmById,
  async (id: number) => {
  // const response = await client.get('/fakeApi/users')
  return mockFilms[id]; //response.data
});
export const fetchFilmPromo = createAsyncThunk(ActionTypes.fetchFilmPromo,
  async () => {
  // const response = await client.get('/fakeApi/users')
  return mockFilms[2]; //response.data
});

const filmsSlice = createSlice({
  name: 'films',
  initialState,
  reducers: {
    genreChanged(state, action: PayloadAction<string>) {
      state.currentGenre = action.payload;
    },
    incrementCatalogSize(state) {
      state.catalogSize += LIST_SIZE;
    }
  },
  extraReducers(builder) {
    builder
    .addCase(fetchFilms.fulfilled, (state, action) => {
      state.status = LoadingStatuses.fulfilled;
      filmsAdapter.addMany(state, action.payload);
    })
    .addCase(fetchFilmPromo.fulfilled, (state, action) => {
      state.promoId = action.payload.id;
      filmsAdapter.addOne(state, action.payload);
    })
   .addCase(fetchFilmById.fulfilled, filmsAdapter.addOne)
   .addCase(filmsRecieved, filmsAdapter.setMany);
  },
});

export const {genreChanged, incrementCatalogSize} = filmsSlice.actions;

export const {
  selectAll: selectAllFilms,
  selectById: selectFilmById,
  selectIds: selectFilmIds,
} = filmsAdapter.getSelectors((state: RootState) => state.films);

export const selectFilmsLoadingStatus = (state: RootState) => state.films.status;
export const selectFilmsLoadingError = (state: RootState) => state.films.error;
export const selectFilmsPromoId = (state: RootState) => state.films.promoId;
export const selectFilmsCurrentGenre = (state: RootState) => state.films.currentGenre;
export const selectFilmsCatalogSize = (state: RootState) => state.films.catalogSize;

export const selectGenres = createSelector(
  selectAllFilms,
  (films) => Array.from(new Set(films.map((film) => film.genre)))
);

export const selectIdsByGenre = createSelector(
  selectAllFilms, (_: RootState, genre: string) => genre,
  (films, genre) => {
    return genre === GENERAL_CATALOG_TAB
    ? films.map((film) => film.id)
    : films.filter((film) => film.genre === genre).map((film) => film.id);
  }
);

export default filmsSlice.reducer;

