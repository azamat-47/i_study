import React, { useState, useEffect } from 'react';
import { MdOutlineDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import axios from 'axios';
import ModalTeachers from './ModalTeachers';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // API URLs
  const API_BASE_URL = 'https://lms-production-94cb.up.railway.app';
  const TEACHERS_URL = `${API_BASE_URL}/teachers`;

  // Fetch teachers data
  useEffect(() => {
    fetchTeachers();
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

  const addTeacher = () => {
    setIsEditMode(false);
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const editTeacher = (teacher) => {
    setIsEditMode(true);
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleTeacherSuccess = () => {
    fetchTeachers();
    setIsEditMode(false);
    setEditingTeacher(null);
  };

  const removeTeacher = async (teacherId) => {
    try {
      await axios.delete(`${TEACHERS_URL}/${teacherId}`);
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error('O\'qituvchini o\'chirishda xatolik:', error);
    }
  };

  const formatValue = (value) => 
    value && String(value).trim().length > 0 ? value : '-';

  const formatRole = (role) => {
    if (!role) return '-';
    const roleMap = {
      'ADMIN': 'Administrator',
      'TEACHER': 'O\'qituvchi',
      'LEAD_TEACHER': 'Bosh o\'qituvchi',
      'ASSISTANT_TEACHER': 'Yordamchi o\'qituvchi'
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
          O'qituvchilar
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          O'qituvchilarni boshqarish
        </p>
      </div>

      {/* Teachers Section */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            O'qituvchilar ro'yxati
          </h2>
          <button
            onClick={addTeacher}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            O'qituvchi qo'shish
          </button>
        </div>
        
        <div className="overflow-x-auto">
  <table className="w-full min-w-full">
    <thead>
      <tr className="border-b border-gray-600">
        <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
          Ism
        </th>
        <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
          Telefon
        </th>
        <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
          Lavozim
        </th>
        <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
          Amallar
        </th>
      </tr>
    </thead>
    <tbody>
      {teachers.length > 0 ? (
        teachers.map((teacher) => (
          <tr
            key={teacher.id}
            className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
          >
            <td className="py-4 px-4 text-white text-sm sm:text-base font-medium">
              {formatValue(teacher.name)}
            </td>
            <td className="py-4 px-4 text-gray-300 text-sm sm:text-base">
              {formatValue(teacher.phone)}
            </td>
            <td className="py-4 px-4 text-gray-300 text-sm sm:text-base">
              {formatRole(teacher.userRole)}
            </td>
            <td className="py-4 px-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => editTeacher(teacher)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer px-3 py-1 rounded hover:bg-blue-400 hover:bg-opacity-10"
                >
                  <CiEdit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeTeacher(teacher.id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer px-3 py-1 rounded hover:bg-red-400 hover:bg-opacity-10"
                >
                  <MdOutlineDelete className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="4"
            className="py-8 px-4 text-center text-gray-400 text-sm sm:text-base"
          >
            Hali o'qituvchi qo'shilmagan
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>



      </div>

      {/* Modal */}
      <ModalTeachers
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTeacherSuccess}
        editData={editingTeacher}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Teachers;