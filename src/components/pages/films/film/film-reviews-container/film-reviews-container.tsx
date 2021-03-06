import React, {FC} from 'react';
import {fetchFilmReviews} from '../../../../../store/film-info/actions';
import {selectFilmReviews} from '../../../../../store/film-info/selectors';
import {useAppDispatch, useAppSelector} from '../../../../../store/store';
import Preloader from '../../../../common/preloader/preloader';
import FilmReviews from '../film-reviews/film-reviews';

interface Props {
  id: number;
  backgroundColor: string;
}
const FilmReviewsContainer:FC<Props> = ({id, backgroundColor}) => {

  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) => selectFilmReviews(state, id));

  React.useEffect(() => {
    if (!reviews) {
      dispatch(fetchFilmReviews(id));
    }
  }, [id, reviews]);

  return (
    <>
      {!reviews
        ? <Preloader backgroundColor={backgroundColor}/>
        : <FilmReviews reviews={reviews.slice(0, 6)} />
      }
    </>
  );
};

export default FilmReviewsContainer;
