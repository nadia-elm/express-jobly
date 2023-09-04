'use strict';

/** Routes for jobs. */

const jsonschema = require('jsonschema');
const jobSchema = require('../schemas/jobSchema.json')
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureLoggedIn } = require('../middleware/auth');
const Job = require('../models/jobs');


const router = new express.Router();

const isAdmin = require('../middleware/isAdmin');
const {ensureLoggedIn} = require('../middleware/auth')

router.get('/', async function (req, res, next) {
  try {
   const jobs = await Job.findAll();
   return res.json({ jobs })
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async(req,res, next) => {
 try{
  const job = await Job.get(req.params.id)
  return res.json({ job})

 }catch(e){
  return next(e)
 }
})

router.post('/', ensureLoggedIn, async(req,res,next => {
 try {
  const validator = jsonschema.validate(req.body,jobSchema);
  if(!validator.valid){
   const errs = validator.errors.map(e => e.stack);
   throw new BadRequestError(errs)
  }
  const job = await Job.create(req.body)
  const res.status(201).json({job})
  
 } catch (error) {
  return next(error)
  
 }
}))

router.patch("/:id", isAdminAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", isAdmin, async function (req, res, next) {
  try {
    await Job.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router
