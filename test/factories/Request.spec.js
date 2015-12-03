/**
 * @author rik
 */
import Request from '../../src/factories/Request';

describe(`Request`, () => {

  it(`should be a function`, (done) => {
    expect(Request).to.be.a('function');
    done();
  });

  describe(`Object req = Request(Object params, Object extendObject)`, () => {

    it(`should return an object`, (done) => {
      expect(Request()).to.be.an('object');
      done();
    });

    it(`should set the options provided as params`, (done) => {
      const expected = {};
      const req = Request(expected);

      const actual = req.params;
      expect(actual).to.equal(expected);

      done();
    });

    it(`should extends itself with the options provided as extendObject`, (done) => {
      const expected = 'val';
      const key = 'key';
      const req = Request(expected, {
        [key]: expected
      });

      const actual = req[key];
      expect(actual).to.equal(expected);

      done();
    });

    describe(`String param = req.param(String key)`, () => {

      it(`should return the value of the property on params object with the key passed in`, (done) => {
        const expected = 'val';
        const key = 'key';

        const req = Request({
          [key]: expected
        });

        const actual = req.param(key);
        expect(actual).to.equal(expected);

        done();
      });

    });

  });

});