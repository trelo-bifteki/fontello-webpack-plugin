const path = require('path');
const stream = require('stream');
const fetch = require('node-fetch');
const FormData = require('form-data');

const defaultOptions = {
  host: 'https://www.fontello.com',
};

/**
 * Returns a new merged object out from the ones provided
 * @param {Object} one
 * @param {Object} another
 */
const extend = (one, another) => Object.assign({}, one, another);

/**
 * @param {*} value
 */
const serialize = value => Buffer.from(JSON.stringify(value));

class FontelloService {

  /**
   * @param {Object} options
   */
  constructor(options) {
    this.options = extend(defaultOptions, options);
    this._session = null;
  }

  initSession() {
      if (this._session) {
        return Promise.resolve(this._session);
      }
      return this._fetchSession();
  }

  _fetchSession() {
    const {host, config} = this.options;
    const body = new FormData();
    body.append(
      'config',
      serialize(config),
      {
        filename: 'config.json',
        contentType: 'application/json',
      }
    );

    return fetch(host, {
      method: 'POST',
      body,
    }).then(response => {
      console.info(response);
    });
  }
}

module.exports = FontelloService;
