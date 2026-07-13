import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
{
 assignmentId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Assignment",
  required:true
 },

 studentId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true
 },

 file:{
  type:String,
  required:true
 },

 marks:{
  type:Number,
  default:0
 }

},
{
 timestamps:true
}
);

const Submission = mongoose.model("Submission",SubmissionSchema);

export default Submission;