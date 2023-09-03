
const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdates", () => {
  // test case without jsToSql mapping
  test('generate SQL expressions without mapping', () => {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = {};
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ['Aliya', 32],
    });
  });
  // test case with jsToSql mapping
  test('generate SQL expressions with mapping', () => {
    const dataToUpdate = { firstName: 'Aliya', age: 88 };
    const jsToSql = {
      firstName: 'first_name',
      age: 'user_age',
    };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toEqual({
      setCols: '"first_name"=$1, "user_age"=$2',
      values: ['Aliya', 88],
    });
  });
  
  // Test case with no data to update
  test('throws BadRequestError when there is no data', () => {
    const dataToUpdate = {};
    // Wrap the function call in an anonymous function to test for exceptions
    expect(() => sqlForPartialUpdate(dataToUpdate)).toThrow(BadRequestError);
  });
})