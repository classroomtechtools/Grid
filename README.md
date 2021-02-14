# Grid

Take a 2d array returned from range.getValues(), and iterate over them. Each row produces a json where headers are keys. Each row can have calculated properties based on values of that row.

## Getting Started

- Install via Library ID `1aF6ka72qAVEfcYoyvftvTWOxih8wcCPo6TUcxgXTjCnwezIhZS6Fmla5`
- Use it

Two features of this library are that it takes the 2d array you send it, and as you go through the `for/of` (in V8) loop, it produces a row object:

```js
const values = [ ["one", "two"], [1, 2] ];
const grid = Grid.new_(values);
for (const row of grid) {
  Logger.log(row.json);  // {one: 1, two: 2}
}
```

You can use destructuring as well:

```js
const values = [ ["one", "two"], [1, 2] ];
const grid = Grid.new_(values);
for (const {json} of grid) {
  Logger.log(json);  // {one: 1, two: 2}
}
```

But rows often need to have calculated values depending on their values, so if you have a `firstName` header and a `lastName` header, and you want a `full name` header, just calculate it:

```js
const values = [ ["firstName", "lastName"], ["S", "Holmes"] ];
const grid = Grid.new_(values, {
  fullName (json) {
    const {firstName, lastName} = json;
    return `${firstName} ${lastName}`;
  }
});
for (const {json} of grid) {
  Logger.log(json);  // {firstName: "S", lastName: "Holmes", fullName "S Holmes"}
}
```

## TODO

Calculated values column-wide (such as for indexing).

## Motivation

Taking a 2d array of spreadsheet values is a pretty common thing, might as well make a nice iterator for it.
