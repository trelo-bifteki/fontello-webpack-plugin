const path = require('path');
const stream = require('stream');
const fetch = require('node-fetch');
const FormData = require('form-data');

const defaultOptions = {
  host: 'http://fontello.com',
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
      return this._fetchSession(this.options);
  }

  _fetchSession(options) {
    const {host, config} = options;
    const body = new FormData();
    const serializedConfig = serialize(config);

    body.append(
      'config',
      serializedConfig,
      {
        filename: "config.json",
        contentType: "application/json"
		});

    return fetch(
      host,
      {
        method: "POST",
        body
      }).then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(response.statusText);
        }
      }).then(responseBody => {
        this._sesssionId = responseBody;

        return responseBody;
    });
  }
}

module.exports = FontelloService;
