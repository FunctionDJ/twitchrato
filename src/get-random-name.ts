import randomNames from "./random-names";

let lastIndex: number;
export default () => {
  let index;

  do {
    index = Math.floor(randomNames.length * Math.random());
  } while (index === lastIndex);

  lastIndex = index;

  return randomNames[index];
}