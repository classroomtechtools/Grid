function module () {
  const {Grid} = Import;
  return Grid;
}


/**
 * Create a new grid
 * @param {Array[]} data2d - A 2d array, can use what is returned from `setValues`
 * @returns {Grid}
 * @example
const values = range.getValues();
const grid = Grid.create(values);
for (const {json} of grid) {
  Logger.log(json);
}
 */
function create (data2d, calculatedProps={}) {
  const {Grid} = Import;
  return new Grid();
}


/**
 * Pass in the named values property of the event from the `onSubmit` callback
 * @param {Object} obj - the named values
 * @returns {Grid}
 * @example
function onSubmit(event); {
  const grid = Grid.fromNamedValues(event.values);
  for (const {json} of grid) {
    Logger.log(json);
  }
}
 */
function fromNamedValues (obj) {
  const {Grid} = Import;
  return Grid.fromNamedValues({obj});
}