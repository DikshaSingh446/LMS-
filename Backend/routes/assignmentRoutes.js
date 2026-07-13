import express from "express";
import mongoose from "mongoose";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js"; // Marks update aur delete ke liye zaroori hai
import upload from "../config/upload.js";

const router = express.Router();

// ================= 1. CREATE ASSIGNMENT =================
router.post("/create", upload.single("file"), async (req, res) => {
  try {
    let { title, description, courseId, teacherId, assignedStudents } = req.body;

    if (!title || !courseId || !teacherId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let parsedStudents = [];
    if (assignedStudents) {
      try {
        parsedStudents = typeof assignedStudents === "string" ? JSON.parse(assignedStudents) : assignedStudents;
      } catch (e) {
        parsedStudents = [];
      }
    }

    const assignment = new Assignment({
      title,
      description,
      courseId,
      teacherId,
      assignedStudents: parsedStudents, // Empty = Sabko dikhega, Selected = Sirf unhe
      file: req.file ? req.file.filename : null
    });

    await assignment.save();
    res.status(201).json({ message: "Assignment Created", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error creating assignment", error: error.message });
  }
});

// ================= 2. GET ASSIGNMENTS (Selective Logic) =================
router.get("/", async (req, res) => {
  try {
    const { userId, role } = req.query; 

    let query = {};
    if (role === "student" && userId) {
      query = {
        $or: [
          { assignedStudents: { $size: 0 } }, // Public
          { assignedStudents: new mongoose.Types.ObjectId(userId) } // Private
        ]
      };
    }

    const data = await Assignment.find(query)
      .populate("courseId", "subjectName")
      .populate("teacherId", "name email")
      .populate("assignedStudents", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error", error: error.message });
  }
});

// ================= 3. DELETE ASSIGNMENT (Cleanup Included) =================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Assignment ID" });
    }

    // Pehle assignment delete karo
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    
    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Ab iss assignment se judi sari submissions bhi delete kar do (Optional but Good Practice)
    await Submission.deleteMany({ assignmentId: id });

    res.json({ message: "Assignment and related submissions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete Error", error: error.message });
  }
});

// ================= 4. UPDATE MARKS (Submission Level) =================
// Note: Marks assignment table mein nahi, submission table mein update hote hain
router.put("/marks/:submissionId", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid Submission ID" });
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { marks: marks },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json({ message: "Marks updated successfully", updatedSubmission });
  } catch (error) {
    res.status(500).json({ message: "Update Error", error: error.message });
  }
});

export default router;