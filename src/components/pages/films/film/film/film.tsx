import React, { FC } from 'react';
import { LoadingStatuses } from '../../../../../constants';
import useLoadFilmById from '../../../../../hooks/load-film-by-id';
import { selectFilmIdsSameGenre, selectFilmsLoadingStatus } from '../../../../../store/slices/films-slice';
import { useAppSelector } from '../../../../../store/store';
import FilmCardList from '../../../../common/film-card-list/film-card-list';
import Footer from '../../../../common/footer/footer';
import Preloader from '../../../../common/preloader/preloader';
import FilmContent from '../film-content/film-content';

const Film:FC = () => {

  const [id, film] = useLoadFilmById(true);
  const filmIdsSameGenre = useAppSelector((state) => selectFilmIdsSameGenre(state, id));
  const filmsLoadingStatus = useAppSelector(selectFilmsLoadingStatus);

  return (
    <>
      {film
        ? <FilmContent film={film} />
        : <Preloader />
      }
      <div className="page-content">
        <section className="catalog catalog--like-this">
          <h2 className="catalog__title">More like this</h2>
          {film && (filmsLoadingStatus === LoadingStatuses.fulfilled)
            ? <FilmCardList ids={filmIdsSameGenre.slice(0, 4)} />
            : <Preloader />}
        </section>
        <Footer />
      </div>
    </>
  );
};
export default Film;
