
const db = require('../db')
const {BadRequestError, NotFoundError} = require('../expressError')
const {} = require('../helpers/sql');

// create a job from data, update db, return new job.
// data should be {title, salary, equity, companyHandle} id SERIAL PRIMARY KEY,
// throw BadRequestError if job already exist in db
class Job {
  static async findAll() {
    const results = await db.query(
      `SELECT title,salary,equity,company_handle
      FROM jobs`
    );
    return results.rows;
  }

  static async create({ title, salary, equity, companyHandle }) {
    // check if the job already exist by title and companyHandle
    const duplicateCheck = await db.query(
      `SELECT title
    FROM jobs
    WHERE title = $1 AND company_handle = $2`,
      [title, companyHandle]
    );
    if (duplicateCheck.rows[0])
      throw new BadRequestError(`job ${title} : duplicate`);

    // insert the new job in db
    const result = await db.query(
      `INSERT INTO jobs
   (title,salary,equity,company_handle)
   Values($1,$2,$3,$4)
   RETURNING id,title, salary,equity,company_handle AS "companyHandle"`,
      [title, salary, equity, companyHandle]
    );
    const job = result.rows[0];

    return job;
  }

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
                  title,
                  equity,
                  company_handle
           FROM jobs
           WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`Job not found for id  : ${id}  `);

    return job;
  }

  
  static async update(jobId, data) {
    const { setCols, values } = generateUpdateSql(data, {});
    const jobIdPlaceholder = '$' + (values.length + 1);

    const query = `UPDATE jobs 
                 SET ${setCols} 
                 WHERE id = ${jobIdPlaceholder} 
                 RETURNING id, 
                           title, 
                           salary, 
                           equity,
                           company_handle AS "companyHandle"`;

    const result = await db.query(query, [...values, jobId]);
    const updatedJob = result.rows[0];

    if (!updatedJob) throw new NotFoundError(`No job: ${jobId}`);

    return updatedJob;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    const job = result.rows[0];
    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}

module.exports = Job