'use strict';
const axios = require('axios').default;
export class pixabayApi {
  #API_KEY = '28723731-5c15bd07d095f3f0e05de01ba';
  #URL = 'https://pixabay.com/api/';

  constructor() {
    this.page = 1;
    this.query = null;
  }

  async fetchPhotoOnSearc() {
    const urlParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.query,
      image_type: `photo`,
      orientation: `horizontal`,
      safesearch: `true`,
      page: this.page,
      per_page: 40,
    });
    try {
      const response = await axios.get(`${this.#URL}?${urlParams}`);

      return response;
    } catch (error) {}
  }
}

// export class pixabayApi {
//   #API_KEY = '28723731-5c15bd07d095f3f0e05de01ba';
//   #URL = 'https://pixabay.com/api/';

//   constructor() {
//     this.page = 1;
//     this.query = null;
//   }

//   async fetchPhotoOnSearc() {
//     try {
//       const response = await axios.get(`${this.#URL}`, {
//         params: {
//           key: this.#API_KEY,
//           q: this.query,
//           image_type: `photo`,
//           orientation: `horizontal`,
//           safesearch: `true`,
//           page: this.page,
//           per_page: 40,
//         },
//       });

//       return response;
//     } catch (error) {}
//   }
// }
