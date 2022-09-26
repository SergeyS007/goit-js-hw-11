import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiService from './news-service';

const galleryImages = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');
const newsAPIService = new NewsApiService();
const galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  animationSpeed: 250,
});

loadMoreButton.classList.add('is-hidden');

form.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMore);

function onSubmit(event) {
  event.preventDefault();
  emptyImagesGallery();
  newsAPIService.query = event.currentTarget.elements.query.value;
  newsAPIService.resetPage();
  console.log(newsAPIService.query);
  if (newsAPIService.query === '') {
    loadMoreButton.classList.add('is-hidden');
    return;
  }
  newsAPIService.fetchImages().then(images => {
    renderImages(images.hits);
    galleryLightbox.refresh();
    if (images.total > 0) {
      loadMoreButton.classList.remove('is-hidden');
    }
    console.log(images);
  });
}

function onLoadMore() {
  newsAPIService.fetchImages().then(images => {
    renderImages(images.hits);
    galleryLightbox.refresh();
  });
}

function emptyImagesGallery() {
  galleryImages.innerHTML = '';
}

function renderImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
          <a  class="gallery-link" href="${largeImageURL}">
<div class="photo-card">
  <img src="${webformatURL}" alt=${tags} loading="lazy" width=300px height=200px/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
  </div>
  </a>
`;
      }
    )
    .join('');
  galleryImages.insertAdjacentHTML('beforeend', markup);
}
