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

formEl.addEventListener('submit', onClickSubmitSearch);

async function onClickSubmitSearch(evt) {
  evt.preventDefault();
  cardsArrEl.innerHTML = '';

  pixabayApiNew.query = inputEl.value.trim();
  pixabayApiNew.page = 1;

  try {
    const cardsArr = await pixabayApiNew.fetchPhotoOnSearc();

    if (inputEl.value.trim() === '') {
      cardsArrEl.innerHTML = '';
      return;
    }

    if (cardsArr.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (cardsArr.data.hits.length < pixabayApiNew.per_page) {
      Notiflix.Notify.info(
        `Hooray! We found ${cardsArr.data.totalHits} images.`
      );

      addCards(cardsArr.data.hits);
    } else {
      Notiflix.Notify.info(
        `Hooray! We found ${cardsArr.data.totalHits} images.`
      );
      addCards(cardsArr.data.hits);
      observer.observe(target);
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
      Notiflix.Notify.info(
        'We&#39re sorry, but you&#39ve reached the end of search results.'
      );
      observer.unobserve(target);
      target.classList.remove('loader');
    }

    addCards(cardsArr.data.hits);
  } catch (err) {
    console.log(err);
  }
}

function addCards(elem) {
  cardsArrEl.insertAdjacentHTML('beforeend', galleryCard(elem));
  SimpleEl.refresh();
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};
const callback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    target.classList.add('loader');
    onClickLoadMoreCards();
  }
};
const observer = new IntersectionObserver(callback, options);
const target = document.querySelector('.inf-load');
// console.log(observer);
// console.log(target);
