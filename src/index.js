import { pixabayApi } from './js/constructor-pixabay';
import galleryCard from './templates/galleryCard.hbs';
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

async function onClickSubmitSearch(evt) {
  evt.preventDefault();
  cardsArrEl.innerHTML = '';

  pixabayApiNew.query = inputEl.value.trim();
  pixabayApiNew.page = 1;

  try {
    const cardsArr = await pixabayApiNew.fetchPhotoOnSearc();

    if (inputEl.value.trim() === '') {
      cardsArrEl.innerHTML = '';
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    }

    if (cardsArr.data.total === 0) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (cardsArr.data.hits.length < pixabayApiNew.per_page) {
      Notiflix.Notify.info(
        `Hooray! We found ${cardsArr.data.totalHits} images.`
      );
      loadMoreBtnEl.classList.add('is-hidden');
      addCards(cardsArr.data.hits);
    } else {
      Notiflix.Notify.info(
        `Hooray! We found ${cardsArr.data.totalHits} images.`
      );
      addCards(cardsArr.data.hits);

      loadMoreBtnEl.classList.remove('is-hidden');
    }

    evt.target.reset();
  } catch (err) {
    console.log(err);
  }
}

async function onClickLoadMoreCards(evt) {
  pixabayApiNew.page += 1;

  try {
    const cardsArr = await pixabayApiNew.fetchPhotoOnSearc();
    if (cardsArr.data.hits.length < pixabayApiNew.per_page) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        'We&#39re sorry, but you&#39ve reached the end of search results.'
      );
    }

    addCards(cardsArr.data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    console.log({ height: cardHeight });
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (err) {
    console.log(err);
  }
}

function addCards(elem) {
  cardsArrEl.insertAdjacentHTML('beforeend', galleryCard(elem));
  SimpleEl.refresh();
}
