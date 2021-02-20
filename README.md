# Grid

Take a 2d array returned from range.getValues(), and iterate over them. Each row produces a json where headers are keys. Each row can have calculated properties based on values of that row.

## Getting Started

- Install via Library ID `1aF6ka72qAVEfcYoyvftvTWOxih8wcCPo6TUcxgXTjCnwezIhZS6Fmla5`
- Check out [documentation](https://classroomtechtools.github.io/Grid/)
- Use it for reading in and auto parsing spreadsheet ranges, so that you can just iterate over them and do whatever

Two features of this library are that it takes the 2d array you send it, and as you go through the `for/of` (in V8) loop, it produces a row object:

```js
const values = [ ["one", "two"], [1, 2] ];
const grid = Grid.create(values);
for (const row of grid) {
  Logger.log(row.headers);  // ["one", "two"]
  Logger.log(row.values);  // [1, 2]
  Logger.log(row.json);  // {one: 1, two: 2}
  Logger.log(row.idx);  // 1
}
```

And you can iterate over the cells in each row: 

```js
for (const row of grid) {
  for (const cell of row) {
    Logger.log(cell.header);
    Logger.log(cell.value);
    Logger.log(cell.idx);
  }
}
```

Destructuring is nice:

```js
const values = [ ["one", "two"], [1, 2] ];
const grid = Grid.create(values);
for (const {json} of grid) {
  for (const {one} of json) {
    Logger.log(one);  // outputs 1, then 2
  }
}
```

Many applications with rows in spreadsheets often need to have calculated values, sorta like **phantom columns**, whose values are derived from native values in the data range.

For example, if you have a `firstName` header and a `lastName` header, and you want to calculate a `fullName` header, just calculate it by passing the constructor an object whose keys are the name of the header, and its values are functions.

```js
const values = [ ["firstName", "lastName"], ["S", "Holmes"] ];
const grid = Grid.create(values, {
  fullName (json) {
    const {firstName, lastName} = json;
    return `${firstName} ${lastName}`;
  },
  serial (json, row) {
    // pad so there are two characters
    return row.idx.toString().padStart(2, '0');
  },

});

for (const {json} of grid) {
  Logger.log(json);  
  // {serial: '01', fullName: "S Holmes", ...}
}
```

If you want to re-define the names of your headers, you can do that after initialization (rows objects are created as they are interated over):

```js
const grid = Grid.create([["one", "two"], [1, 2]]);
grid.headers = ["ONE", "TWO"];
for (const {json} of grid) {
  Logger.log(json);  // {ONE: 1, TWO: 2}
}
```

## TODO

Calculated values column-wide (such as for indexing).

## Motivation

Taking a 2d array of spreadsheet values is a pretty common thing, might as well make a nice iterator for it.
