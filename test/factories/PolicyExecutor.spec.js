/**
 * @author rik
 */
import PolicyExecutor from '../../src/factories/PolicyExecutor';

describe(`PolicyExecutor`, () => {

  it(`should be a function`, (done) => {
    expect(PolicyExecutor).to.be.a('function');
    done();
  });

  describe(`const policyExecutor = PolicyExecutor(Object options)`, () => {

    it(`should return an object`, (done) => {
      expect(PolicyExecutor()).to.be.an('object');
      done();
    });

    it(`should add the provided policies`, (done) => {
      const expected = function () {
        return Promise.resolve();
      };
      const policyExecutor = PolicyExecutor({
        policies: {
          isLoggedIn: expected
        }
      });

      const actual = policyExecutor.policies.isLoggedIn;
      expect(actual).to.equal(expected);

      done();
    });

    describe(`policyExecutor.add(String name, Function predicate)`, () => {
      it(`should add the policy by name`, (done) => {
        const policyExecutor = PolicyExecutor();
        const expected = function () {
        };
        policyExecutor.add('name', expected);
        const actual = policyExecutor.policies.name;

        expect(actual).to.equal(expected);
        done();
      });
    });

    describe(`policyExecutor.add(Object policies)`, () => {
      it(`should add the policies, using their keys as names`, (done) => {
        const policyExecutor = PolicyExecutor();
        const expected = function () {
        };

        policyExecutor.add({
          name: expected
        });

        const actual = policyExecutor.policies.name;

        expect(actual).to.equal(expected);
        done();
      });
    });

    describe(`policyExecutor.execute(String policy, Object data)`, () => {

      it(`should call the policy function with a Request where the parameters are the provided data`, (done) => {
        const policyExecutor = PolicyExecutor();
        const expected = {random_data: true};

        policyExecutor.add({
          name: mockFunction()
        });

        when(policyExecutor.policies.name)(anything())
          .then((req) => {
            expect(req.params).to.equal(expected);
            done();
          });

        policyExecutor.execute('name', expected);
      });

    });

    describe(`policyExecutor.execute(Array<String> policies, Object data)`, () => {

      it(`should call the policy functions with a Request where the parameters are the provided data`, (done) => {
        const policyExecutor = PolicyExecutor();
        const expected = {random_data: true};

        policyExecutor.add({
          name: mockFunction(),
          name2: mockFunction()
        });

        when(policyExecutor.policies.name)(anything())
          .then((req) => {
            expect(req.params).to.equal(expected);
          });

        when(policyExecutor.policies.name2)(anything())
          .then((req) => {
            expect(req.params).to.equal(expected);
            done();
          });

        policyExecutor.execute(['name', 'name2'], expected);
      });

    });

    describe(`policyExecutor.execute(Array<String> policies | String policy, Object data)`, () => {

      it(`Should resolve if no policies are passed in`, (done) => {
        const policyExecutor = PolicyExecutor();

        policyExecutor.execute([])
          .then(() => {
            // todo find a better way to see if a the promise resolved,
            // chai-as-promised seems to fail
            expect(true).to.equal(true);
            done();
          });

        done();
      });

      it(`Should resolve if all policies pass`, (done) => {
        const policyExecutor = PolicyExecutor();

        policyExecutor.add({
          name: mockFunction(),
          name2: mockFunction()
        });

        when(policyExecutor.policies.name)(anything())
          .thenReturn(Promise.resolve());

        when(policyExecutor.policies.name2)(anything())
          .thenReturn(Promise.resolve());

        policyExecutor.execute(['name', 'name2'])
          .then(() => {
            // todo find a better way to see if a the promise resolved,
            // chai-as-promised seems to fail
            expect(true).to.equal(true);
            done();
          });

      });

      it(`Should reject if one policy rejects`, (done) => {
        const policyExecutor = PolicyExecutor();

        policyExecutor.add({
          name: mockFunction(),
          name2: mockFunction()
        });

        when(policyExecutor.policies.name)(anything())
          .thenReturn(Promise.resolve());

        when(policyExecutor.policies.name2)(anything())
          .thenReturn(Promise.reject());

        policyExecutor.execute(['name', 'name2'])
          .then(null, () => {
            // todo find a better way to see if a the promise resolved,
            // chai-as-promised seems to fail
            expect(true).to.equal(true);
            done();
          });

      });

    });

  });

});