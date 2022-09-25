import Notiflix from 'notiflix';

const KEY = '30062388-a44765a9b25a2c7fffe70ed63';
const URL_BASE = 'https://pixabay.com/api/';
const loadMoreButton = document.querySelector('.load-more');
const axios = require('axios');

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  async fetchImages() {
    try {
      const response = await axios.get(
        `${URL_BASE}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`
      );
      const images = response.data;
      if (images.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (this.page === 1) {
        Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);
        loadMoreButton.style.display = '';
      }
      let quantityOfPages = images.totalHits / this.per_page;
      let isLastPage = this.page >= quantityOfPages;
      if (isLastPage) {
        Notiflix.Notify.info(
          `We're sorry, but you've reached the end of search results.`
        );
        loadMoreButton.style.display = 'none';
      }
      console.log(images);
      this.page += 1;
      return images;
    } catch (error) {
      console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
}
