import { pixabayApi } from '../js/constructor-pixabay';
import galleryCard from '../templates/galleryCard.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApiNew = new pixabayApi();
const SimpleEl = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('[name="searchQuery"]');
const cardsArrEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

loadMoreBtnEl.classList.add('is-hidden');

formEl.addEventListener('submit', onClickSubmitSearch);
loadMoreBtnEl.addEventListener('click', onClickLoadMoreCards);

function onClickSubmitSearch(evt) {
  evt.preventDefault();

  if (inputEl.value.trim() === '') {
    cardsArrEl.innerHTML = '';
    loadMoreBtnEl.classList.add('is-hidden');
    return;
  }
  pixabayApiNew.query = inputEl.value.trim();
  pixabayApiNew.page = 1;

  pixabayApiNew
    .fetchPhotoOnSearc()
    .then(dataResult => {
      if (dataResult.data.total === 0 || inputEl.value === '') {
        loadMoreBtnEl.classList.add('is-hidden');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.info(
        `Hooray! We found ${dataResult.data.totalHits} images.`
      );

      cardsArrEl.innerHTML = galleryCard(dataResult.data.hits);
      SimpleEl.refresh();
      loadMoreBtnEl.classList.remove('is-hidden');
    })
    .catch(err => {
      console.log(err);
    });

  // createCArds();

  evt.target.reset();
}

function onClickLoadMoreCards(evt) {
  pixabayApiNew.page += 1;

  pixabayApiNew
    .fetchPhotoOnSearc()
    .then(dataResult => {
      if (dataResult.data.hits.length < 40) {
        loadMoreBtnEl.classList.add('is-hidden');
        Notiflix.Notify.info(
          'We&#39re sorry, but you&#39ve reached the end of search results.'
        );
      }

      cardsArrEl.insertAdjacentHTML(
        'beforeend',
        galleryCard(dataResult.data.hits)
      );
      SimpleEl.refresh();

      // const { height: cardHeight } = document
      //   .querySelector('.link-card')
      //   .firstElementChild.getBoundingClientRect();

      // window.scrollBy({
      //   top: cardHeight * 2,
      //   behavior: 'smooth',
      // });
    })
    .catch(err => {
      console.log(err);
    });

  // loadMoreCards();
}

// async function createCArds() {
//   try {
//     const cardsArr = await pixabayApiNew.fetchPhotoOnSearc();
//     if (cardsArr.data.total === 0 || inputEl.value === ' ') {
//       loadMoreBtnEl.classList.add('is-hidden');
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//       return;
//     }
//     Notiflix.Notify.info(
//       `Hooray! We found ${dataResult.data.totalHits} images.`
//     );
//     cardsArrEl.innerHTML = galleryCard(cardsArr.data.hits);
//     loadMoreBtnEl.classList.remove('is-hidden');
//   } catch (err) {
//     console.log(err.mesage);
//   }
// }

// async function loadMoreCards() {
//   const cardsAdditionalArr = await pixabayApiNew.fetchPhotoOnSearc();
//   try {
//     if (cardsAdditionalArr.data.hits.length < 40) {
//       loadMoreBtnEl.classList.add('is-hidden');
//       Notiflix.Notify.info(
//         'We&#39re sorry, but you&#39ve reached the end of search results.'
//       );
//     }
//     cardsArrEl.insertAdjacentHTML(
//       'beforeend',
//       galleryCard(cardsAdditionalArr.data.hits)
//     );
//   } catch (err) {
//     console.log(err.mesage);
//   }
// }
