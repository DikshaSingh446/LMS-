import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function Courses() {

 const [courses, setCourses] = useState([]);

 const [semester, setSemester] = useState("");
 const [subjectName, setSubjectName] = useState("");

 const [unitInputs, setUnitInputs] = useState({});

 const user = JSON.parse(localStorage.getItem("user"));

 useEffect(() => {
  fetchCourses();
 }, []);

 const fetchCourses = async () => {

  try {
   const res = await API.get("/courses");
   setCourses(res.data || []);
  } catch (error) {
   console.log(error);
  }

 };


 // ADD SUBJECT

 const addSubject = async () => {

  if (!semester || !subjectName) {
   alert("Enter semester and subject name");
   return;
  }

  try {

   await API.post("/courses/add", {
    semester: Number(semester),
    subjectName: subjectName.trim()
   });

   setSemester("");
   setSubjectName("");

   fetchCourses();

  } catch (error) {

   console.log(error);
   alert("Error adding subject");

  }

 };


 // ADD UNIT

 const addUnit = async (courseId) => {

  const unitName = unitInputs[courseId];

  if (!unitName) {
   alert("Enter unit name");
   return;
  }

  try {

   await API.put(`/courses/addUnit/${courseId}`, {
    unitName: unitName.trim()
   });

   setUnitInputs({
    ...unitInputs,
    [courseId]: ""
   });

   fetchCourses();

  } catch (error) {

   console.log(error);
   alert("Error adding unit");

  }

 };


 // DELETE UNIT

 const deleteUnit = async (courseId, index) => {

  try {

   await API.delete(`/courses/deleteUnit/${courseId}/${index}`);

   fetchCourses();

  } catch (error) {

   console.log(error);
   alert("Error deleting unit");

  }

 };


 return (

 <>
 <Navbar />

 <div className="container mt-4">

 <h2>Subjects</h2>

 {user?.role === "teacher" && (

 <div className="card p-3 mb-4">

 <input
 type="number"
 className="form-control mb-2"
 placeholder="Semester"
 value={semester}
 onChange={(e) => setSemester(e.target.value)}
 />

 <input
 className="form-control mb-2"
 placeholder="Subject Name"
 value={subjectName}
 onChange={(e) => setSubjectName(e.target.value)}
 />

 <button
 className="btn btn-success"
 onClick={addSubject}
 >
 Add Subject
 </button>

 </div>

 )}


 {courses.map((course) => (

 <div key={course._id} className="card p-3 mb-3">

 <h4>Semester {course.semester}</h4>

 <h5>{course.subjectName}</h5>


 {user?.role === "teacher" && (

 <div>

 <input
 className="form-control mb-2"
 placeholder="Unit Name"
 value={unitInputs[course._id] || ""}
 onChange={(e) =>
  setUnitInputs({
   ...unitInputs,
   [course._id]: e.target.value
  })
 }
 />

 <button
 className="btn btn-primary mb-2"
 onClick={() => addUnit(course._id)}
 >
 Add Unit
 </button>

 </div>

 )}


 {course.units?.map((unit, index) => (

 <div key={index} className="border p-2 mb-2">

 {unit.unitName}

 {user?.role === "teacher" && (

 <button
 className="btn btn-danger btn-sm ms-3"
 onClick={() => deleteUnit(course._id, index)}
 >
 Delete
 </button>

 )}

 </div>

 ))}

 </div>

 ))}

 </div>

 </>

 );

}

export default Courses;