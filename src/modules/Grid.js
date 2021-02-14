/**
 * Class which can be iterated over and produces json for each row
 * @example
const grid = Grid.create([["one", "two"], [1, 2]]);
for (const {json} of row) {
  Logger.log(json);  // {one: 1, two: 2}
}
 * @example
// using calculatedProps
const grid = Grid.create([["one", "two"], [1, 2]], {
  sum (json) {
    // use header names as keys on json
    return json.one + json.two;
  }
});
for (const {json} of row) {
  Logger.log(json);  // {one: 1, two: 2, sum: 3}
}
 */
class Grid {

  /**
   * Created either via call to `Grid.create` or `Grid.namedValues`, but class can be returned by `Grid.module()`
   * @param {Object} [np] - named parameters
   * @param {Array[]} [np.data2d] - 2d array, can be set after instance creation if necessary
   * @param {Object} [np.calculatedProps] - keys repesent the header, and the values should be functions that return the calculated value for that header for any object
   */
  constructor ({data2d=[], calculatedProps={}}={}) {
    this.data2d = data2d;
    this.calculatedProps = calculatedProps;
  }

  *[Symbol.iterator] () {
    // get headers, start at 1
    const headers = this.headers;
    for (let idx = 1; idx < this.data2d.length; idx++) {
      const values = this.data2d[idx];
      const row = new Row({headers, values, idx, calculatedProps: this.calculatedProps});
      yield row;
    }
  }

  update ({r, c, value}) {
    this.data2d[r][c] = value;
  }

  getValues () {
    return this.data2d;
  }

  addCalculatedProp (header, func) {
    this.calculatedProps[header] = func;
  }

  setCalculatedProperties (props) {
    this.calculatedProps = props;
  }

  static fromNamedValues ({obj}) {
    const headers = Object.keys(obj);
    const data2d = Object.values(obj).reduce(
      (acc, value, idx) => {
        const header = headers[idx];
        acc[1].push(value.pop());
        return acc;
      }, [headers, []]
    );
    return new Grid({data2d});
  }

  get headers () {
    return this.data2d[0];
  }

  set headers (headers) {
    this.data2d = [headers, ...this.data2d.slice(1)];
  }
}

/**
 * Instances of `Row` are returned in the iterator
 * @property {String[]} headers - the first row of the `data2d` passed
 * @property {Any[]} values - the raw row as an array, as it appears in the spreadsheet
 * @property {Number} idx - the row number, 1 indexed
 * @property {Object} json - the key/value obj for this row
 */
class Row {

  /**
   * Creates a row
   * @param {Object} np - named parameter
   * @param {String[]} np.headers - the order of headers should match that appearing in `values`
   * @param {Any[]} np.values - the order of values should match that appearing in `headers`
   * @param {Object} np.calculatedProps - keys are header names, returned values are the values for that row. Each value is a function, taking two parameters: `json` and `row`
   */
  constructor ({headers, values, idx, calculatedProps}) {
    this.headers = headers;
    this.values = values;
    this.idx = idx;
    const nativeJson = headers.reduce(
      (acc, h, i) => {
        acc[h] = values[i];
        return acc;
      }, {}
    )
    const extendedJson = Object.entries(calculatedProps).reduce(
      (acc, [prop, func]) => {
        acc[prop] = func(nativeJson, this);
        return acc;
      }, {}
    );

    this.json = Object.assign(nativeJson, extendedJson);
  }

  *[Symbol.iterator] () {
    for (let h = 0; h < this.headers.length; h++) {
      const header = this.headers[h];
      const value = this.json[header];
      const col = new Cell({header, value, idx: h});
      yield col;
    }
  }
}

/**
 * An individual cell in the row
 * @property {String} header - header
 * @property {Any} value - the value at this cell
 * @property {Number} idx - the index
 */
class Cell {

  /**
   * Created when iterating over row
   * @param {Object} np - named parameter
   * @param {String} np.header - header
   * @param {Any} np.value - the value at this cell
   * @param {Number} np.idx - the index
   */
  constructor ({header, value, idx}) {
    this.header = header;
    this.value = value;
    this.idx = idx;
  }
}

export {Grid};
