// Students.jsx

import React, { useState, useEffect } from "react";
import ModalStudents from "./ModalStudents";
import Modal2Teachers from "./Modal2Teachers";
import ModalTeachers from "./ModalTeachers"; // <--- QO'SHILDI: Xatolikni tuzatish uchun
import { MdOutlineDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import axios from "axios";

const Students = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state'lari alohida boshqariladi
  const [isTeacherAssignModalOpen, setIsTeacherAssignModalOpen] = useState(false); // Modal2Teachers uchun
  const [isTeacherEditModalOpen, setIsTeacherEditModalOpen] = useState(false); // ModalTeachers (tahrirlash) uchun
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Tahrirlash uchun alohida state'lar
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null); // <--- O'ZGARTIRILDI: O'qituvchi uchun alohida state
  
  const [isEditMode, setIsEditMode] = useState(false);

  // API URLs
  const API_BASE_URL = "https://lms-production-94cb.up.railway.app";
  const TEACHERS_URL = `${API_BASE_URL}/teachers`;
  const STUDENTS_URL = `${API_BASE_URL}/students`;
  const GROUPS_URL = `${API_BASE_URL}/courses`;

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(TEACHERS_URL);
      setTeachers(response.data);
    } catch (error) {
      console.error("O'qituvchilarni yuklashda xatolik:", error);
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
      console.error("O'quvchilarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeTeacher = async (teacherId) => {
    try {
      await axios.delete(`${TEACHERS_URL}/${teacherId}`);
      setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
    } catch (error) {
      console.error("'O'qituvchini o'chirishda xatolik:", error);
    }
  };

  const removeStudent = async (studentId) => {
    try {
      await axios.delete(`${STUDENTS_URL}/${studentId}`);
      setStudents(students.filter((student) => student.id !== studentId));
    } catch (error) {
      console.error("O'quvchini o'chirishda xatolik:", error);
    }
  };
  
  // O'qituvchini guruhga biriktirish modalini ochadi
  const assignTeacher = () => {
    setIsTeacherAssignModalOpen(true);
  };

  const addStudent = () => {
    setIsEditMode(false);
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };

  const editStudent = (student) => {
    setIsEditMode(true);
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  // O'qituvchini tahrirlash modalini ochadi
  const editTeacher = (teacher) => {
    setIsEditMode(true);
    setEditingTeacher(teacher); // <--- O'ZGARTIRILDI: To'g'ri state'ga saqlash
    setIsTeacherEditModalOpen(true); // <--- O'ZGARTIRILDI: Tahrirlash modalini ochish
  };

  const handleTeacherSuccess = () => {
    fetchTeachers();
    setIsEditMode(false);
    setEditingTeacher(null);
  };

  const handleStudentSuccess = () => {
    fetchStudents();
    setIsEditMode(false);
    setEditingStudent(null);
  };

  const formatValue = (value) =>
    value && String(value).trim().length > 0 ? value : "-";

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("uz-UZ");
    } catch (error) {
      return dateString;
    }
  };

  const formatCourses = (courses) => {
    if (!courses || courses.length === 0) return "-";
    return courses.map((course) => course.name).join(", ");
  };

  const formatRole = (role) => {
    if (!role) return "-";
    const roleMap = {
      ADMIN: "Administrator",
      TEACHER: "O'qituvchi",
      STUDENT: "O'quvchi",
    };
    return roleMap[role] || role;
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-2">
          Guruh 1
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Ushbu guruhdagi o'qituvchilar va o'quvchilarni boshqarish
        </p>
      </div>

      {/* Teachers Section */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            O'qituvchilar
          </h2>
          <button
            onClick={assignTeacher} // <-- O'ZGARTIRILDI
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            O'qituvchi qo'shish
          </button>
        </div>

        <div className="overflow-x-auto">
          {/* O'qituvchilar jadvali (o'zgarishsiz qoldi) */}
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  To'liq ism
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Email
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Telefon
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base hidden sm:table-cell">
                  Lavozim
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody >
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-700">
                    <td className="py-3 px-2 sm:px-4 text-white text-sm sm:text-base">
                      {formatValue(teacher.name)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">
                      {formatValue(teacher.email)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">
                      {formatValue(teacher.phone)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden sm:table-cell">
                      {formatRole(teacher.userRole)}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editTeacher(teacher)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200 cursor-pointer px-3 py-2 rounded-md hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          <CiEdit className="inline-block mr-1" />
                        </button>
                        <button
                          onClick={() => removeTeacher(teacher.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-200 cursor-pointer px-3 py-2 rounded-md hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          <MdOutlineDelete className="inline-block mr-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-4 px-2 sm:px-4 text-center text-gray-400 text-sm sm:text-base"
                  >
                    Hali o'qituvchi qo'shilmagan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Students Section (o'zgarishsiz qoldi) */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            O'quvchilar
          </h2>
          <button
            onClick={addStudent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            O'quvchi qo'shish
          </button>
        </div>
        <div className="overflow-x-auto">
          {/* O'quvchilar jadvali (o'zgarishsiz qoldi) */}
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  To'liq ism
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Email
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Telefon
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base hidden sm:table-cell">
                  Ro'yxatdan o'tgan sana
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base hidden lg:table-cell">
                  Kurslar
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-700">
                    <td className="py-3 px-2 sm:px-4 text-white text-sm sm:text-base">
                      {formatValue(student.name)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">
                      {formatValue(student.email)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">
                      {formatValue(student.phone)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden sm:table-cell">
                      {formatDate(student.enrollmentDate)}
                    </td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden lg:table-cell">
                      {formatCourses(student.courses)}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editStudent(student)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200 cursor-pointer px-3 py-2 rounded-md hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          <CiEdit className="inline-block mr-1" />
                       
                        </button>
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all duration-200 cursor-pointer px-3 py-2 rounded-md hover:shadow-lg hover:scale-105 active:scale-95"
                        >
                          <MdOutlineDelete className="inline-block mr-1" />
                    
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-4 px-2 sm:px-4 text-center text-gray-400 text-sm sm:text-base"
                  >
                    Hali o'quvchi qo'shilmagan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Modals */}
       {/* O'qituvchini guruhga biriktirish uchun modal */}
       <Modal2Teachers
         isOpen={isTeacherAssignModalOpen}
         onClose={() => setIsTeacherAssignModalOpen(false)}
         onSuccess={handleTeacherSuccess}
       />
       
       {/* O'qituvchini tahrirlash uchun modal */}
       <ModalTeachers
         isOpen={isTeacherEditModalOpen}
         onClose={() => setIsTeacherEditModalOpen(false)}
         onSuccess={handleTeacherSuccess}
         editData={editingTeacher} // <--- O'ZGARTIRILDI
         isEditMode={isEditMode}
       />
       
       {/* O'quvchini tahrirlash/qo'shish uchun modal */}
       <ModalStudents
         isOpen={isStudentModalOpen}
         onClose={() => setIsStudentModalOpen(false)}
         onSuccess={handleStudentSuccess}
         editData={editingStudent}
         isEditMode={isEditMode}
       />
     </div>
   );
 };

export default Students;