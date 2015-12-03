/**
 * @author rik
 */
import _ from 'lodash';

/**
 * {@link Request}s are passed to policies when executing them, they have a params method to get parameters
 *
 * @class Request
 *
 * @param {Object} [params={}] - Parameters / data of this 'request'
 * @param {Object} [extendObject={}] - Object with which the Request instance should be extended
 *
 * @example
 * const req = Request({attr: 'val1'}, {attr2: 'val2'});
 * req.params.attr === 'val1'; // true
 * req.param('attr') === 'val1'; // true
 * req.attr2 === 'val2'; // true
 */
function Request(params = {}, extendObject = {}) {
  const props = {
    params: {
      value: params
    }
  };

  const req = Object.create(Request.prototype, props);

  _.extend(req, extendObject);

  return req;
}

Request.prototype = {

  /**
   * Gets a property from the params object by key.
   *
   * @method param
   * @memberof Request
   * @instance
   *
   * @param key {String} Key of the param to get
   *
   * @returns {*}
   */
  param(key) {
    return this.params[key];
  }

};

export default Request;