import ApiService from './apiService';
import {LISTNAME_TO_WATCH, LISTNAME_TO_QUEUE} from './modal'
import nothingImg from '../images/empty_library.jpg'

const library = document.querySelector('.watched')
const watchedBtn = document.querySelector('.header__bnt--watched');
const queueBtn = document.querySelector('.header__bnt--queue');

const myLibraryApi = new ApiService();

watchedBtn.addEventListener('click', makeLibraryCollectionsWatched);
queueBtn.addEventListener('click', makeLibraryCollectionsQueue);

(async () => {
  makeLibraryCollections (LISTNAME_TO_WATCH)  
})();

function makeLibraryCollectionsWatched() {
  library.innerHTML = ''
  makeLibraryCollections (LISTNAME_TO_WATCH)  
}
function makeLibraryCollectionsQueue() {
  library.innerHTML = ''
  makeLibraryCollections (LISTNAME_TO_QUEUE)  
}

function makeLibraryCollections (localStorageKey) {
  const watchedFilms = localStorage.getItem(localStorageKey);
  const parsedWatchedFilms = JSON.parse(watchedFilms);

  if (watchedFilms) {
    parsedWatchedFilms.forEach(async el => {
      try {
        const res = await myLibraryApi.getMovieById(el);
        const movieById = res.data
        const genres = movieById.genres.map(el => el.name).join(', ')
        const date = new Date(movieById.release_date).getFullYear()

        const markup = `
          <li class='movie' data-id='${movieById.id}'>
          <img
            class='movie__img'
            width='440'
            src='https://image.tmdb.org/t/p/original/${movieById.poster_path}'
            alt='${movieById.title}'
            loading='lazy'
          />
          <div class='movie__info'>
            <p class='movie__name'>${movieById.title}</p>
            <p class='movie__description'>${genres}
              | ${date}</p>
          </div>
          </li>
        `
      library.insertAdjacentHTML('beforeend', markup)
      } catch (err) {
        console.log(err);
      }
    })
  } 
  if (parsedWatchedFilms.length === 0) {
    const markup = `
          <li class='empty__item'>
          <img
            class='empty__img'
            width='440'
            src="${nothingImg}"
            loading='lazy'
          />
          </li>
        `
    library.innerHTML = markup;    
  }
}