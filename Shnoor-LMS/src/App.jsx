import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import { SocketProvider } from './context/SocketContext';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import InstructorLayout from './components/layout/InstructorLayout';
import StudentLayout from './components/layout/StudentLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfileManagement from './pages/admin/ProfileManagement';
import ApproveCourses from './pages/admin/ApproveCourses';
import AssignCourse from './pages/admin/AssignCourse';
import CertificateConfig from './pages/admin/CertificateConfig';
import AddInstructor from './pages/admin/AddInstructor';
import ApproveUsers from './pages/admin/ApproveUsers';
import ManageUsers from './pages/admin/ManageUsers';

// Shared Pages
import ProfileSettings from './pages/shared/ProfileSettings';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AddCourse from './pages/instructor/AddCourse';
import CourseList from './pages/instructor/CourseList';
import ExamBuilder from './pages/instructor/ExamBuilder';
import InstructorSettings from './pages/instructor/InstructorSettings';
import InstructorChat from './pages/instructor/InstructorChat';
import StudentPerformance from './pages/instructor/StudentPerformance';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import CourseDetail from './pages/student/CourseDetail';
import CoursePlayer from './pages/student/CoursePlayer';
import StudentExams from './pages/student/StudentExams';
import ExamRunner from './pages/student/ExamRunner';
import MyCertificates from './pages/student/MyCertificates';
// FIX: Ensure this file exists at src/pages/student/Chat.jsx
import StudentChat from './pages/student/Chat'; 
import PracticeArea from './pages/student/PracticeArea';
import PracticeSession from './pages/student/PracticeSession';
import Leaderboard from './pages/student/Leaderboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="add-instructor" element={<AddInstructor />} />
              <Route path="approve-users" element={<ApproveUsers />} />
              <Route path="approve-courses" element={<ApproveCourses />} />
              <Route path="assign-course" element={<AssignCourse />} />
              <Route path="certificates" element={<CertificateConfig />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="profile-management" element={<ProfileManagement />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            {/* Instructor Routes */}
            <Route path="/instructor" element={
              <ProtectedRoute allowedRoles={['instructor', 'company']}>
                <InstructorLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="add-course" element={<AddCourse />} />
              <Route path="courses" element={<CourseList />} />
              <Route path="add-exam/:courseId" element={<ExamBuilder />} />
              <Route path="exams" element={<ExamBuilder />} />
              <Route path="settings" element={<InstructorSettings />} />
              <Route path="profile-settings" element={<ProfileSettings />} />
              <Route path="performance" element={<StudentPerformance />} />
              <Route path="chat" element={<InstructorChat />} />
            </Route>

            {/* Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute allowedRoles={['student', 'learner']}>
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="course/:courseId" element={<CourseDetail />} />
              <Route path="course/:courseId/learn" element={<CoursePlayer />} />
              <Route path="exams" element={<StudentExams />} />
              <Route path="exam/:examId" element={<ExamRunner />} />
              <Route path="practice" element={<PracticeArea />} />
              <Route path="practice/session/:challengeId" element={<PracticeSession />} />
              <Route path="certificates" element={<MyCertificates />} />
              <Route path="chat" element={<StudentChat />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;