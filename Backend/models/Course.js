import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({

 semester: {
  type: Number,
  required: true
 },

 subjectName: {
  type: String,
  required: true
 },

 units: [
  {
   unitName: {
    type: String,
    required: true
   }
  }
 ]

},
{
 timestamps: true
});

export default mongoose.model("Course", CourseSchema);