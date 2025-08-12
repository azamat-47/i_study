import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // API URLs - o'zgartirish mumkin
  const API_BASE_URL = 'https://your-api-domain.com/api';
  const TEACHERS_URL = `${API_BASE_URL}/teachers`;
  const STUDENTS_URL = `${API_BASE_URL}/students`;
  const GROUPS_URL = `${API_BASE_URL}/groups`;

  // Teachers data
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Students data
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(TEACHERS_URL);
      setTeachers(response.data);
    } catch (error) {
      console.error('Teachers yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(STUDENTS_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Students yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeTeacher = async (teacherId) => {
    try {
      await axios.delete(`${TEACHERS_URL}/${teacherId}`);
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error('Teacher o\'chirishda xatolik:', error);
    }
  };

  const removeStudent = async (studentId) => {
    try {
      await axios.delete(`${STUDENTS_URL}/${studentId}`);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Student o\'chirishda xatolik:', error);
    }
  };

  const addTeacher = async () => {
    // Add teacher modal yoki form ochish
    console.log('Add Teacher clicked');
  };

  const addStudent = async () => {
    // Add student modal yoki form ochish
    console.log('Add Student clicked');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900">
        <div className="text-lg text-white">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-2">Group 1</h1>
        <p className="text-sm sm:text-base text-gray-400">Manage teachers and students in this group</p>
      </div>

      {/* Teachers Section */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Teachers</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Name</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Role</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-700">
                    <td className="py-3 px-2 sm:px-4 text-white text-sm sm:text-base">{teacher.name}</td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">{teacher.role}</td>
                    <td className="py-3 px-2 sm:px-4">
                      <button
                        onClick={() => removeTeacher(teacher.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer px-2 py-1 rounded hover:bg-blue-400 hover:bg-opacity-10"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-2 sm:px-4 text-center text-gray-400 text-sm sm:text-base">
                    Hali teacher qo'shilmagan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={addTeacher}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
          >
            Add Teacher
          </button>
          <button
            onClick={addStudent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
          >
            Add Student
          </button>
        </div>
      </div>

      {/* Students Section */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Students</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Name</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Payment Status</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-700">
                    <td className="py-3 px-2 sm:px-4 text-white text-sm sm:text-base">{student.name}</td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">
                      {student.paymentStatus === 'paid' ? (
                        <span className="text-green-400 font-medium">
                          Paid || {student.amount} so'm
                        </span>
                      ) : (
                        <span className="text-red-400 font-medium">
                          {student.paymentStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <button
                        onClick={() => removeStudent(student.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer px-2 py-1 rounded hover:bg-blue-400 hover:bg-opacity-10"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 px-2 sm:px-4 text-center text-gray-400 text-sm sm:text-base">
                    Hali student qo'shilmagan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
