import './css/styles.css';
const _ = require('lodash.debounce');
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const countryListElement = country => {
  let li = document.createElement('li');
  let img = document.createElement('img');
  let heading = document.createElement('h4');
  img.src = country.flags.svg;
  heading.innerHTML = country.name.official;
  li.appendChild(img);
  li.appendChild(heading);
  countryList.appendChild(li);
};

const countryInfoDetails = countries => {
  countryInfo.innerHTML = `
        <img src="${countries[0].flags.svg}"/><h3>${
    countries[0].name.official
  }</h3>
        <p><span class="bold">Capital:</span> ${countries[0].capital}</p>
        <p><span class="bold">Population:</span> ${countries[0].population}</p>
        <p><span class="bold">Languages:</span> ${Object.values(
          countries[0].languages
        )}</p>                 
    `;
};

const clearCode = () => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
};

function printCountries(countries) {
  let countriesListHTML = '';
  if (countries) {
    if (countries.length === 1) {
      countryInfoDetails(countries);
    } else if (countries.length >= 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else {
      countries.forEach(country => {
        countryListElement(country);
      });
    }
  }
}

searchBox.addEventListener(
  'input',
  _(
    () => {
      clearCode();
      if (!searchBox.value) {
        return;
      }
      fetchCountries(searchBox.value.trim()).then(countries => {
        if (countries) {
          printCountries(countries);
        }
      });
    },
    DEBOUNCE_DELAY,
    {
      leading: false,
      trailing: true,
    }
  )
);



const COUNTRIES_API_URL = "https://restcountries.com";
const API_VERSION = "v3.1";

function fetchCountries(name) {
    return fetch(`${COUNTRIES_API_URL}/${API_VERSION}/name/${name}?fields=name,capital,population,flags,languages`)
        .then((response) => {
            if (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    if (response.status === 404) {
                        Notiflix.Notify.failure('Oops, there is no country with that name');
                        return Promise.reject('error 404')
                    } else {
                        return Promise.reject('some other error: ' + response.status)
                    }
                }
            }
        })
        .catch((error) => {
            console.log("Error: ", error);
        })
};