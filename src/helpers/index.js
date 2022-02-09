const { validate: expressValidate } = require('express-validation');

/**
 * Wrapper around joi to validate the api requests.
 * @param {Joi} schema - Joi schema to be validated using express validation
 */
function validate(schema) {
  return expressValidate(schema, { keyByField: true }, { abortEarly: false });
}

function getRandomInt(max) {
  const randomItem = (Math.floor(Math.random() * max));
  if (randomItem === 0) {
    return 1;
  }else if (randomItem === 4){
    return 5;
  }
  return randomItem;
}

function getRandomName() {
  const myArray = ["Apples","Bananas","Pears"];
  const randomItem = myArray[Math.floor(Math.random() * myArray.length)];
  return randomItem;
}

module.exports = {
  validate,
  getRandomInt,
  getRandomName,
};
