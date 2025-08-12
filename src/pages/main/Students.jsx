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
      console.error('O\'qituvchilarni yuklashda xatolik:', error);
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
      console.error('O\'quvchilarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeTeacher = async (teacherId) => {
    try {
      await axios.delete(`${TEACHERS_URL}/${teacherId}`);
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error("'O'qituvchini o'chirishda xatolik:", error);
    }
  };

  const removeStudent = async (studentId) => {
    try {
      await axios.delete(`${STUDENTS_URL}/${studentId}`);
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('O\'quvchini o\'chirishda xatolik:', error);
    }
  };

  const addTeacher = async () => {
    // O\'qituvchi qo\'shish modal yoki form ochish
    console.log('O\'qituvchi qo\'shish bosildi');
  };

  const addStudent = async () => {
    // O\'quvchi qo\'shish modal yoki form ochish
    console.log('O\'quvchi qo\'shish bosildi');
  };

  const formatValue = (value) => (value && String(value).trim().length > 0 ? value : '-');
  const getFullName = (item) => {
    const value = item?.fullName || [item?.firstName, item?.lastName].filter(Boolean).join(' ');
    return formatValue(value);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-2">Guruh 1</h1>
        <p className="text-sm sm:text-base text-gray-400">Ushbu guruhdagi o'qituvchilar va o'quvchilarni boshqarish</p>
      </div>

      {/* Teachers Section */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">O'qituvchilar</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">To'liq ism</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Telefon</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base hidden sm:table-cell">Lavozim</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-700">
                    <td className="py-3 px-2 sm:px-4 text-white text-sm sm:text-base">{getFullName(teacher)}</td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">{formatValue(teacher.phone)}</td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden sm:table-cell">{formatValue(teacher.role)}</td>
                    <td className="py-3 px-2 sm:px-4">
                      <button
                        onClick={() => removeTeacher(teacher.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer px-2 py-1 rounded hover:bg-blue-400 hover:bg-opacity-10"
                      >
                        "O'chirish"
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 px-2 sm:px-4 text-center text-gray-400 text-sm sm:text-base">
                    Hali o'qituvchi qo'shilmagan
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
            "O'qituvchi qo'shish"
          </button>
          <button
            onClick={addStudent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
          >
            "O'quvchi qo'shish"
          </button>
        </div>
      </div>

      {/* Students Section */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">O'quvchilar</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">To'liq ism</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Telefon</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base hidden sm:table-cell">To'lov holati</th>
                <th className="text-left py-3 px-2 sm:px-4 text-gray-300 font-medium text-sm sm:text-base">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-700">
                    <td className="py-3 px-2 sm:px-4 text-white text-sm sm:text-base">{getFullName(student)}</td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base">{formatValue(student.phone)}</td>
                    <td className="py-3 px-2 sm:px-4 text-gray-300 text-sm sm:text-base hidden sm:table-cell">
                      {student.paymentStatus === 'paid' ? (
                        <span className="text-green-400 font-medium">To'langan || {formatValue(student.amount)} so'm</span>
                      ) : (
                        <span className="text-red-400 font-medium">{formatValue(student.paymentStatus)}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <button
                        onClick={() => removeStudent(student.id)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer px-2 py-1 rounded hover:bg-blue-400 hover:bg-opacity-10"
                      >
                        "O'chirish"
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 px-2 sm:px-4 text-center text-gray-400 text-sm sm:text-base">
                    Hali o'quvchi qo'shilmagan
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
