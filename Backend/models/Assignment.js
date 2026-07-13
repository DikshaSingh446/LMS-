import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
{
 title:{
  type:String,
  required:true,
  trim:true
 },

 description:{
  type:String,
  trim:true
 },

 courseId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Course",
  required:true
 },

 teacherId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 // ✅ NEW (IMPORTANT)
 assignedStudents:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  }
 ],

 deadline:{
  type:Date
 },

 file:{
  type:String
 }

},
{
 timestamps:true
}
);

const Assignment = mongoose.model("Assignment",AssignmentSchema);

export default Assignment;