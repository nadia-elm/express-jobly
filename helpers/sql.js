const { BadRequestError } = require("../expressError");

// design a function to generate SQL expressions for performing partial updates to database records
// function takes 2 arguments:
// dataToUpdate: object keys are columns names and values the new values to set for that column
// jsToSql: if provided rename keys from the object dataToUpdate to the names provided in jsToSql so they will match names of columns 

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
