// import { useEffect, useState } from "react";
// import API from "../api";
// import Navbar from "../components/Navbar";

// function Assignments(){

//  const [assignments,setAssignments]=useState([]);
//  const [courses,setCourses]=useState([]);
//  const [submissions,setSubmissions]=useState([]);

//  const [title,setTitle]=useState("");
//  const [description,setDescription]=useState("");
//  const [courseId,setCourseId]=useState("");

//  const [file,setFile]=useState(null);

//  const user=JSON.parse(localStorage.getItem("user"));

//  useEffect(()=>{
//   fetchAssignments();
//   fetchCourses();
//   fetchSubmissions();
//  },[]);


//  const fetchAssignments=async()=>{
//   const res=await API.get("/assignments");
//   setAssignments(res.data);
//  };


//  const fetchCourses=async()=>{
//   const res=await API.get("/courses");
//   setCourses(res.data);
//  };


//  const fetchSubmissions=async()=>{
//   const res=await API.get("/submissions");
//   setSubmissions(res.data);
//  };


//  // CREATE ASSIGNMENT

//  const createAssignment=async()=>{

//   if(!title || !courseId){
//    alert("Fill all fields");
//    return;
//   }

//   try{

//    const formData=new FormData();

//    formData.append("title",title);
//    formData.append("description",description);
//    formData.append("courseId",courseId);
//    formData.append("teacherId",user._id);
//    formData.append("file",file);

//    await API.post("/assignments/create",formData);

//    alert("Assignment Uploaded");

//    setTitle("");
//    setDescription("");
//    setFile(null);

//    fetchAssignments();

//   }

//   catch(error){

//    console.log(error);
//    alert("Upload Error");

//   }

//  };


//  // STUDENT SUBMIT

//  const submitAssignment=async(id)=>{

//   if(!file){
//    alert("Select file");
//    return;
//   }

//   const formData=new FormData();

//   formData.append("assignmentId",id);
//   formData.append("studentId",user._id);
//   formData.append("file",file);

//   await API.post("/submissions/submit",formData);

//   alert("Submitted");

//  };


//  // TEACHER GIVE MARKS

//  const giveMarks=async(id,marks)=>{

//   await API.put(`/submissions/marks/${id}`,{
//    marks
//   });

//   fetchSubmissions();

//  };


//  return(

//  <>
//  <Navbar/>

//  <div className="container mt-4">

//  <h2 className="mb-4">Assignments</h2>


//  {/* TEACHER CREATE */}

//  {user.role==="teacher" && (

//   <div className="card p-3 mb-4">

//    <h5>Create Assignment</h5>

//    <input
//    className="form-control mb-2"
//    placeholder="Title"
//    value={title}
//    onChange={(e)=>setTitle(e.target.value)}
//    />

//    <textarea
//    className="form-control mb-2"
//    placeholder="Description"
//    value={description}
//    onChange={(e)=>setDescription(e.target.value)}
//    />


//    <select
//    className="form-control mb-2"
//    onChange={(e)=>setCourseId(e.target.value)}
//    >

//    <option>Select Course</option>

//    {courses.map(c=>(
//     <option key={c._id} value={c._id}>
//      {c.courseName}
//     </option>
//    ))}

//    </select>


//    <input
//    type="file"
//    className="form-control mb-2"
//    onChange={(e)=>setFile(e.target.files[0])}
//    />


//    <button
//    className="btn btn-primary"
//    onClick={createAssignment}
//    >
//    Upload Assignment
//    </button>

//   </div>

//  )}


//  {/* ASSIGNMENTS */}

//  {assignments.map(a=>(

//   <div key={a._id} className="card p-3 mb-3">

//    <h5>{a.title}</h5>

//    <p>{a.description}</p>

//    {a.file && (

//     <a
//     href={`http://localhost:5000/uploads/${a.file}`}
//     target="_blank"
//     rel="noreferrer"
//     >

//     Download File

//     </a>

//    )}


//    {/* STUDENT SUBMIT */}

//    {user.role==="student" && (

//     <div className="mt-2">

//      <input
//      type="file"
//      className="form-control mb-2"
//      onChange={(e)=>setFile(e.target.files[0])}
//      />

//      <button
//      className="btn btn-success"
//      onClick={()=>submitAssignment(a._id)}
//      >

//      Submit Assignment

//      </button>

//     </div>

//    )}

//   </div>

//  ))}



//  {/* TEACHER SUBMISSION LIST */}

//  {user.role==="teacher" && (

//   <div className="mt-4">

//   <h3>Student Submissions</h3>

//   {submissions.map(s=>(

//    <div key={s._id} className="card p-3 mb-2">

//    <p>Student ID : {s.studentId}</p>

//    <a
//    href={`http://localhost:5000/uploads/${s.file}`}
//    target="_blank"
//    rel="noreferrer"
//    >

//    View Submission

//    </a>


//    <div className="mt-2">

//    <input
//    placeholder="Marks"
//    className="form-control mb-2"
//    onChange={(e)=>s.marks=e.target.value}
//    />

//    <button
//    className="btn btn-warning"
//    onClick={()=>giveMarks(s._id,s.marks)}
//    >

//    Add Marks

//    </button>

//    </div>

//    <p>Marks : {s.marks}</p>

//    </div>

//   ))}

//   </div>

//  )}


//  </div>

//  </>
//  );

// }

// export default Assignments;


import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
    fetchStudents();
  }, []);

  // ================= API CALLS =================
  const fetchAssignments = async () => {
    try {
      // ✅ Backend logic ke liye query params zaroori hain
      const res = await API.get(`/assignments?userId=${user._id}&role=${user.role}`);
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/auth/users");
      setStudents(res.data || []);
    } catch (err) { console.error(err); }
  };

  // ================= TEACHER ACTIONS =================
  const createAssignment = async () => {
    if (!title || !courseId) {
      alert("Please fill Title and Select Course");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("courseId", courseId);
    formData.append("teacherId", user._id);
    if (file) formData.append("file", file);
    // ✅ Selective students logic
    formData.append("assignedStudents", JSON.stringify(selectedStudents));

    try {
      await API.post("/assignments/create", formData);
      alert("Assignment Created Successfully!");
      setTitle(""); setDescription(""); setFile(null); setSelectedStudents([]);
      fetchAssignments();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await API.delete(`/assignments/${id}`);
      fetchAssignments();
    } catch (err) { console.error(err); }
  };

  const getStatus = async (id) => {
    try {
      const res = await API.get(`/submissions/status/${id}`);
      setStatus((prev) => ({ ...prev, [id]: res.data }));
    } catch (err) { console.error(err); }
  };

  // ================= STUDENT ACTIONS =================
  const submitAssignment = async (id) => {
    if (!file) { alert("Please select a file first"); return; }
    const formData = new FormData();
    formData.append("assignmentId", id);
    formData.append("studentId", user._id);
    formData.append("file", file);

    try {
      await API.post("/submissions/submit", formData);
      alert("Assignment Submitted!");
      setFile(null);
    } catch (err) { alert("Submission failed"); }
  };

  const handleSelect = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Assignments Management</h2>

        {/* CREATE SECTION (TEACHER ONLY) */}
        {user?.role === "teacher" && (
          <div className="card p-3 mb-4 shadow-sm border-primary">
            <h5>Create New Assignment</h5>
            <input className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            
            <select className="form-control mb-2" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((c) => <option key={c._id} value={c._id}>{c.subjectName}</option>)}
            </select>

            <div className="mb-2 border p-2 rounded bg-light">
              <h6>Assign to (Optional - Empty for All):</h6>
              <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                {students.map((s) => (
                  <div key={s._id} className="form-check">
                    <input className="form-check-input" type="checkbox" checked={selectedStudents.includes(s._id)} onChange={() => handleSelect(s._id)} />
                    <label className="form-check-label">{s.name} ({s.email})</label>
                  </div>
                ))}
              </div>
            </div>

            <input type="file" className="form-control mb-2" onChange={(e) => setFile(e.target.files[0])} />
            <button className="btn btn-primary w-100" onClick={createAssignment} disabled={loading}>
              {loading ? "Uploading..." : "Create & Upload"}
            </button>
          </div>
        )}

        {/* LIST SECTION */}
        <div className="row">
          {assignments.map((a) => (
            <div key={a._id} className="col-md-6 mb-3">
              <div className="card h-100 p-3 shadow-sm border-0 bg-white">
                <div className="d-flex justify-content-between align-items-start">
                   <h5 className="text-primary">{a.title}</h5>
                   <span className="badge bg-info text-dark">{a.courseId?.subjectName || "N/A"}</span>
                </div>
                <p className="text-muted small my-2">{a.description}</p>
                
                {a.file && (
                  <a href={`${BASE_URL}/uploads/${a.file}`} target="_blank" className="btn btn-sm btn-link p-0 text-start mb-2">
                    📄 View Attachment
                  </a>
                )}
                
                <hr className="my-2" />

                {/* TEACHER BUTTONS */}
                {user.role === "teacher" && (
                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-sm btn-outline-info" onClick={() => getStatus(a._id)}>Status</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteAssignment(a._id)}>Delete</button>
                  </div>
                )}

                {/* STATUS VIEW */}
                {status[a._id] && (
                  <div className="mt-2 p-2 bg-light rounded x-small">
                    <div className="text-success">✔ Submitted: {status[a._id].submitted?.length || 0}</div>
                    <div className="text-danger">✖ Pending: {status[a._id].notSubmitted?.length || 0}</div>
                  </div>
                )}

                {/* STUDENT SUBMISSION */}
                {user.role === "student" && (
                  <div className="mt-3">
                    <input type="file" className="form-control form-control-sm mb-2" onChange={(e) => setFile(e.target.files[0])} />
                    <button className="btn btn-sm btn-success w-100" onClick={() => submitAssignment(a._id)}>Submit My Work</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {assignments.length === 0 && <p className="text-center text-muted">No assignments available.</p>}
        </div>
      </div>
    </>
  );
}

export default Assignments;