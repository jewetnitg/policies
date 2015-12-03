/**
 * @author rik
 */
import _ from 'lodash';
import Request from './Request';

/**
 * The PolicyExecutor is in charge of executing policies. Policies can be provided when constructing or when constructed by using the {@link PolicyExecutor#add} method, policies can be executed using the {@link PolicyExecutor#execute} method. For information on the req object passed into policies, please refer to the documentation of the {@link Request}.
 *
 * @class PolicyExecutor
 *
 * @param options {Object} Object with the properties listed below
 *
 * @property policies {Object<Function>} Hashmap with policies
 * @property {Function} [reqFactory=Request] The Request factory used to created the req object passed to policies.
 * The Request factory is called with two argument, the params/data of this 'request' and an object the request should be extended with, see {@link Request} for more information. Your implementation should meet the specifications defined there
 *
 * @see Request
 *
 * @example
 * const policyExecutor = PolicyExecutor({
 *   policies: {
 *     isLoggedIn(req) {
 *       return new Promise((resolve, reject) => {
 *         // determine whether the user is logged in or not
 *         // resolve if he / she is,
 *         // reject if he / she isn't
 *       });
 *     }
 *   }
 * });
 */
function PolicyExecutor(options = {}) {
  const props = {
    policies: {
      value: options.policies || {}
    },
    requestFactory: {
      value: options.requestFactory || Request
    }
  };

  return Object.create(PolicyExecutor.prototype, props);
}

PolicyExecutor.prototype = {

  /**
   * Adds one or more policies.
   *
   * @param name {String|Object} Name of the policy, or a hashmap of policies
   * @param predicate {Function|undefined} Function that returns a promise
   * @example
   * policyExecutor.add('isLoggedIn', function (req) {...});
   * // or
   * policyExecutor.add({
   *   'isLoggedIn': function (req) {...}
   * });
   */
  add(name, predicate) {
    const type = typeof name;
    if (type === 'object') {
      _.each(name, (fn, _name) => {
        this.add(_name, fn);
      });
    } else if (type === 'string') {
      this.policies[name] = predicate;
    }
  },

  /**
   * Executes one or more policies with data. If no policies are passed it returns a resolving Promise
   *
   * @method execute
   * @memberof PolicyExecutor
   * @instance
   * @param policies {String|Array<String>} The policy/policies to execute
   * @param {Object} [data={}] Parameters/data for this policy 'request'
   * @returns {Promise}
   * @example
   * policyExecutor.execute('isLoggedIn', {someParam: 'someValue'});
   * policyExecutor.execute(['isLoggedIn'], {someParam: 'someValue'});
   */
  execute(policies = [], data = {}) {
    if (!policies || !policies.length) {
      return Promise.resolve();
    }

    if (Array.isArray(policies)) {
      return Promise.all(
        _.map(policies, (policy) => {
          return this.execute(policy, data);
        })
      );
    } else if (typeof policies === 'string') {
      const policy = this.policies[policies];

      if (!policy) {
        throw new Error(`Can't execute policy '${policies}', policy not defined.`);
      }

      const req = this.requestFactory(data);

      return policy(req);
    } else {
      throw new Error(`Can't execute policies, policies should be provided as a string or array of strings`);
    }
  }

};

export default PolicyExecutor;