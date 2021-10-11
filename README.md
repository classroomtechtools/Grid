# Grid

Take control of Google spreadsheet data ranges by converting them to jsons, and: 

1. Define the exact header names, and then use them as the property name
2. Create "calculated fields" or, a cooler name might be "phantom columns"
3. Allow nested objects and arrays (!)
4. Remove keys
5. Able to iterate across all rows and columns before converting to jsons

## Getting Started

- Install via Library ID `1aF6ka72qAVEfcYoyvftvTWOxih8wcCPo6TUcxgXTjCnwezIhZS6Fmla5`
- Use with `const grid = Grid.create(...)`

## Examples

For a spreadsheet with the following values:

|A|B|C|
|-|-|-|
|Student ID|Name|Email1|Email2|
|564|Noname|noname@example.com|fake@example.com|

… and bringing in `data` via code …

```js
const data = SpreadsheetApp.openById(...).getSheetByName(...).getDataRange().getValues();
```

… can be converted to jsons with ease:

```js
const grid = Grid.create(values);
const jsons = grid.toJsons();
```

`jsons` will be:

```js
[
  {
    Student ID: 564,
    First: "Noname",
    Last: "Nobody",
    Email1: "564@example.com",
    Email2: "fake@example.com"
  }
]
```

This is not most convenient for a script. Grid lets us:

1. Define the headers to have names that match our key names
2. Create a `full_name` key that is just concat of first and last name
3. Turn the two emails into an array
4. Remove keys

The below demonstrates all four capabilities. Let's define the exact names for the keys:

```js
const grid = Grid.create(values);
grid.headers(['id', 'first_name', 'last_name', 'email1', 'email2']);
const jsons = grid.toJsons();
```

Now `jsons` will be:

```js
[
  {
    id: 564,
    first_name: "Noname",
    last_name: "Nobody",
    email1: "564@example.com",
    email2: "fake@example.com"
  }
]
```

Grid lets us define calculated values based on values in each row at creation time. We just pass an object of keys whose keys are functions:

```js
const grid = Grid.create(values, {
  last_name(json) {
    return `${json.first_name} ${json.last_name}`;
  }
});
// ^--- mapping object of functions that return new fields
grid.headers(['id', 'first_name', 'last_name', 'email1', 'email2']);
const jsons = grid.toJsons();
```

Now `jsons` will be:

```js
[
  {
    id: 564,
    first_name: "Noname",
    last_name: "Nobody",
    email1: "564@example.com",
    email2: "fake@example.com",
    full_name: "Noname Nobody"
  }
]
```

What if we wanted to remove the keys `first_name` and `last_name` entirely?

```js
const grid = Grid.create(values, {
  last_name(json) {
    return `${json._first_name} ${json._last_name}`;
    //             ^--- add underscores
  }
});
grid.headers(['id', '_first_name', '_last_name', 'email']);
//                   ^--- add underscores
const jsons = grid.toJsons();
```

Grid removes any header that starts with an underscore with a call to `toJsons`. The jsons will be: 

```js
[
  {
    id: 564,
    email: "564@example.com"
    full_name: "Noname Nobody"
  }
]
```

Finally, let's convert those two email fields into an array. This is accomplished by using a naming convention in the headers:

```js
const grid = Grid.create(values);
grid.headers([
  'id',
  '_first_name',  
  '_last_name',
  'email[0]',  // the first item in array
  'email[1]'   // the second item in array
]);
const jsons = grid.toJsons();
```

Now `jsons` is:

```js
[
  {
    id: 564,
    email: ["564@example.com", "fake@example.com"],
  }
]
```

In other words, you have full control of data grid from a spreadsheet.

## Iteration

Grid.create access a 2d array and exposes an iteration api via a `for/of` (in V8) loop:

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


## TODO

Calculated values column-wide (such as for indexing).

## Motivation

Taking a 2d array of spreadsheet values is a pretty common thing, might as well make a nice API for it.
