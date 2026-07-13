import express from "express";
import Course from "../models/Course.js";

const router = express.Router();


// ADD SUBJECT
router.post("/add", async (req, res) => {

 try {

  console.log("BODY:", req.body);   // debugging

  const { semester, subjectName } = req.body;

  if (!semester || !subjectName) {
   return res.status(400).json({
    message: "Semester and Subject Name required"
   });
  }

  const course = new Course({
   semester: Number(semester),
   subjectName: subjectName.trim(),
   units: []
  });

  await course.save();

  res.status(201).json({
   message: "Subject added",
   course
  });

 } catch (error) {

  console.log("ADD SUBJECT ERROR:", error);

  res.status(500).json({
   message: "Error adding subject",
   error: error.message
  });

 }

});


// GET ALL SUBJECTS
router.get("/", async (req, res) => {

 try {

  const courses = await Course.find();

  res.json(courses);

 } catch (error) {

  res.status(500).json({
   message: "Error fetching courses",
   error: error.message
  });

 }

});


// ADD UNIT
router.put("/addUnit/:id", async (req, res) => {

 try {

  const { unitName } = req.body;

  if (!unitName) {
   return res.status(400).json({
    message: "Unit name required"
   });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  course.units.push({
   unitName: unitName.trim()
  });

  await course.save();

  res.json(course);

 } catch (error) {

  console.log("ADD UNIT ERROR:", error);

  res.status(500).json({
   message: "Error adding unit",
   error: error.message
  });

 }

});


// DELETE UNIT
router.delete("/deleteUnit/:courseId/:index", async (req, res) => {

 try {

  const course = await Course.findById(req.params.courseId);

  if (!course) {
   return res.status(404).json({
    message: "Course not found"
   });
  }

  course.units.splice(req.params.index, 1);

  await course.save();

  res.json({
   message: "Unit deleted",
   course
  });

 } catch (error) {

  res.status(500).json({
   message: "Error deleting unit",
   error: error.message
  });

 }

});

export default router;