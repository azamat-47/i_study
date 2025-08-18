import React, { useState, useEffect } from 'react';
import { MdOutlineDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import axios from 'axios';
import ModalGroups from './ModalGroups'; 

const Main = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // API URL
  const API_BASE_URL = 'https://lms-production-94cb.up.railway.app';
  const GROUPS_URL = `${API_BASE_URL}/courses`;

  // Guruhlarni yuklash funksiyasi
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(GROUPS_URL);
      setGroups(response.data);
    } catch (error) {
      console.error('Guruhlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modalni ochish (yangi guruh qo'shish uchun)
  const addGroup = () => {
    setIsEditMode(false);
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  // Modalni ochish (guruhni tahrirlash uchun)
  const editGroup = (group) => {
    setIsEditMode(true);
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  // Muvaffaqiyatli amal (qo'shish/tahrirlash) dan so'ng
  const handleGroupSuccess = () => {
    fetchGroups(); // Ro'yxatni yangilash
    setIsModalOpen(false); // Modalni yopish
    setIsEditMode(false);
    setEditingGroup(null);
  };

  // Guruhni o'chirish
  const removeGroup = async (groupId) => {
    // Optimistik UI: O'chirish so'rovini yuborishdan oldin UI'dan olib tashlash
    const originalGroups = [...groups];
    setGroups(groups.filter(group => group.id !== groupId));

    try {
      await axios.delete(`${GROUPS_URL}/${groupId}`);
    } catch (error) {
      console.error('Guruhni o\'chirishda xatolik:', error);
      // Xatolik bo'lsa, asl holatga qaytarish
      setGroups(originalGroups);
      // Foydalanuvchiga xatolik haqida xabar berish mumkin
    }
  };

  // Qiymatni formatlash
  const formatValue = (value) =>
    value && String(value).trim().length > 0 ? value : '-';
  
  // Narxni formatlash
  const formatFee = (fee) => {
    if (typeof fee !== 'number') return '-';
    return `${fee.toLocaleString('uz-UZ')} so'm`;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900">
        <div className="text-lg text-white">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      {/* Sahifa sarlavhasi */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-2">
          Guruhlar
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          O'quv markazidagi mavjud guruhlarni boshqarish
        </p>
      </div>

      {/* Guruhlar bo'limi */}
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Guruhlar ro'yxati
          </h2>
          <button
            onClick={addGroup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            Guruh qo'shish
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Guruh nomi
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Izoh
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Narxi
                </th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium text-sm sm:text-base">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <tr
                    key={group.id}
                    className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-4 px-4 text-white text-sm sm:text-base font-medium">
                      {formatValue(group.name)}
                    </td>
                    <td className="py-4 px-4 text-gray-300 text-sm sm:text-base">
                      {formatValue(group.description)}
                    </td>
                    <td className="py-4 px-4 text-green-400 text-sm sm:text-base">
                      {formatFee(group.fee)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editGroup(group)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors cursor-pointer px-3 py-1 rounded hover:bg-blue-400 hover:bg-opacity-10"
                        >
                          <CiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => removeGroup(group.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer px-3 py-1 rounded hover:bg-red-400 hover:bg-opacity-10"
                        >
                          <MdOutlineDelete className="h-5 w-5" />
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
                    Hali guruh qo'shilmagan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal oynasi */}
      <ModalGroups
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGroupSuccess}
        editData={editingGroup}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Main;