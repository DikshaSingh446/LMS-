import express from "express";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import upload from "../config/upload.js";
import mongoose from "mongoose";

const router = express.Router();

// ================= STUDENT SUBMIT ASSIGNMENT =================
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;

    if (!assignmentId || !studentId || !req.file) {
      return res.status(400).json({ message: "Assignment ID, Student ID and File are required" });
    }

    const existing = await Submission.findOne({ assignmentId, studentId });

    if (existing) {
      return res.status(400).json({ message: "You already submitted this assignment" });
    }

    const submission = new Submission({
      assignmentId,
      studentId,
      file: req.file.filename
    });

    await submission.save();
    res.status(201).json({ message: "Assignment Submitted Successfully", submission });

  } catch (error) {
    console.error("SUBMIT ERROR:", error);
    res.status(500).json({ message: "Submission Error", error: error.message });
  }
});

// ================= VIEW SUBMISSION STATUS =================
router.get("/status/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ message: "Invalid Assignment ID" });
    }

    // 1. Assignment fetch karein with assigned students
    const assignment = await Assignment.findById(assignmentId).populate("assignedStudents", "name email");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // 2. Iss assignment ki saari submissions fetch karein
    const submissions = await Submission.find({ assignmentId }).populate("studentId", "name email");

    // 3. Submitted students ki list nikalein
    const submitted = submissions.map(s => s.studentId).filter(s => s !== null);

    // 4. Not Submitted students ki list calculate karein
    let notSubmitted = [];
    if (assignment.assignedStudents && assignment.assignedStudents.length > 0) {
      const submittedIds = submitted.map(s => s._id.toString());
      notSubmitted = assignment.assignedStudents.filter(student => 
        !submittedIds.includes(student._id.toString())
      );
    }

    res.json({ submitted, notSubmitted });

  } catch (error) {
    console.error("STATUS ERROR:", error);
    res.status(500).json({ message: "Error fetching status", error: error.message });
  }
});

// ================= TEACHER VIEW ALL SUBMISSIONS =================
router.get("/", async (req, res) => {
  try {
    const data = await Submission.find()
      .populate("studentId", "name email")
      .populate("assignmentId", "title")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
});

// ================= TEACHER GIVE MARKS =================
router.put("/marks/:id", async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks: req.body.marks },
      { new: true }
    );
    res.json({ message: "Marks Updated", submission });
  } catch (error) {
    res.status(500).json({ message: "Error updating marks", error: error.message });
  }
});

export default router;