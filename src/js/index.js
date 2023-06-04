import '../scss/styles.scss';
const breedSelect = document.getElementById('breed-select');
const getPictureButton = document.getElementById('get-picture');
const favoriteButton = document.getElementById('favorite');
const pictureElement = document.getElementById('picture');
const favoritesElement = document.getElementById('favorites');

let savedPictures = [];

const printFavorites = () => {
  const fragment = document.createDocumentFragment();
  savedPictures.forEach(url => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const button = document.createElement('button');
    button.textContent = 'Unsave';
    img.src = url;
    div.append(img);
    div.append(button);
    fragment.append(div);
  });
  favoritesElement.append(fragment);
};

const fetchData = url => fetch(url);

const getPicture = breed => {
  const request = fetchData(`https://dog.ceo/api/breed/${breed}/images/random`);
  request
    .then(response => response.json())
    .then(data => {
      const img = document.createElement('img');
      img.src = data.message;
      pictureElement.innerHTML = '';
      pictureElement.append(img);
      favoriteButton.hidden = false;
    });
};

const getBreeds = () => {
  const request = fetchData('https://dog.ceo/api/breeds/list/all');

  request
    .then(response => response.json())
    .then(data => {
      const allBreeds = Object.keys(data.message);
      const fragment = document.createDocumentFragment();
      allBreeds.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        fragment.append(option);
      });
      breedSelect.append(fragment);
    });
};

favoritesElement.addEventListener('click', e => {
  const url = e.target.src;
  if (url) {
    e.target.remove();
    console.log(savedPictures);
    savedPictures = savedPictures.filter(item => item !== url);
    console.log(savedPictures);
    localStorage.setItem('favoriteDogs', JSON.stringify(savedPictures));
  }
});

favoriteButton.addEventListener('click', () => {
  const url = pictureElement.children[0].src;
  if (!savedPictures.includes(url)) {
    const img = document.createElement('img');
    img.src = url;
    favoritesElement.append(img);
    savedPictures.push(url);
    localStorage.setItem('favoriteDogs', JSON.stringify(savedPictures));
  }
});

getPictureButton.addEventListener('click', () => {
  const breed = breedSelect.value;
  getPicture(breed);
});

getBreeds();

if (localStorage.getItem('favoriteDogs')) {
  savedPictures = JSON.parse(localStorage.getItem('favoriteDogs'));
} else {
  localStorage.setItem('favoriteDogs', JSON.stringify(savedPictures));
}
savedPictures && printFavorites();
