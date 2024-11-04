const express = require('express');
const app = express();
app.use(express.json());

let students = [];
let courses = [];
let enrollments = [];

// 1. Student Endpoints

// Add a new student
app.post('/students', (req, res) => {
    const newStudent = { id: students.length + 1, ...req.body };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Get all students
app.get('/students', (req, res) => {
    res.json(students);
});

// Get a specific student
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send("Student not found");
    res.json(student);
});

// Update a student
app.put('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send("Student not found");
    Object.assign(student, req.body);
    res.json(student);
});

// Delete a student
app.delete('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send("Student not found");
    students.splice(index, 1);
    res.send("Student deleted successfully");
});

// Get a student's courses and grades
app.get('/students/:id/courses', (req, res) => {
    const studentCourses = enrollments.filter(e => e.student_id === parseInt(req.params.id))
        .map(enrollment => {
            const course = courses.find(c => c.id === enrollment.course_id);
            return { course, grade: enrollment.grade };
        });
    res.json(studentCourses);
});

// 2. Course Endpoints

// Add a new course
app.post('/courses', (req, res) => {
    const newCourse = { id: courses.length + 1, ...req.body };
    courses.push(newCourse);
    res.status(201).json(newCourse);
});

// Get all courses
app.get('/courses', (req, res) => {
    res.json(courses);
});

// Get a specific course
app.get('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course not found");
    res.json(course);
});

// Update a course
app.put('/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course not found");
    Object.assign(course, req.body);
    res.json(course);
});

// Delete a course
app.delete('/courses/:id', (req, res) => {
    const index = courses.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send("Course not found");
    courses.splice(index, 1);
    res.send("Course deleted successfully");
});

// Get all students enrolled in a specific course
app.get('/courses/:id/students', (req, res) => {
    const enrolledStudents = enrollments.filter(e => e.course_id === parseInt(req.params.id))
        .map(enrollment => {
            const student = students.find(s => s.id === enrollment.student_id);
            return { student, grade: enrollment.grade };
        });
    res.json(enrolledStudents);
});

// 3. Enrollment Endpoints

// Enroll a student in a course
app.post('/enrollments', (req, res) => {
    const { student_id, course_id } = req.body;
    const newEnrollment = { id: enrollments.length + 1, student_id, course_id, grade: null };
    enrollments.push(newEnrollment);
    res.status(201).json(newEnrollment);
});

// Update a student's grade
app.put('/enrollments/:id/grade', (req, res) => {
    const enrollment = enrollments.find(e => e.id === parseInt(req.params.id));
    if (!enrollment) return res.status(404).send("Enrollment not found");
    enrollment.grade = req.body.grade;
    res.json(enrollment);
});

app.listen(3000, () => {
    console.log("Academic Portal API is running on port 3000");
});
