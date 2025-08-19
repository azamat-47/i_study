import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider, Modal, Input, DatePicker, Checkbox } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import dayjs from 'dayjs';
import axios from 'axios';

const useStyle = createStyles(() => ({}));

const ModalStudents = ({ isOpen, onClose, onSuccess, editData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrollmentDate: '',
    courses: []
  });
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { styles } = useStyle();
  const token = useTheme();

  const API_BASE_URL = 'https://lms-production-94cb.up.railway.app';
  const COURSES_URL = `${API_BASE_URL}/courses`;
  const STUDENTS_URL = `${API_BASE_URL}/students`;

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      if (isEditMode && editData) {
        setFormData({
          name: editData.name || '',
          email: editData.email || '',
          phone: editData.phone || '',
          enrollmentDate: editData.enrollmentDate || '',
          courses: editData.courses?.map(course => course.id) || []
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, isEditMode, editData]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      enrollmentDate: '',
      courses: []
    });
    setErrors({});
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(COURSES_URL);
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Kurslarni yuklashda xatolik:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCourseChange = (courseId) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(id => id !== courseId)
        : [...prev.courses, courseId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Ism kiritilishi shart';
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'To‘g‘ri email formatini kiriting';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqam kiritilishi shart';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'To‘g‘ri telefon raqam formatini kiriting';
    }
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = 'Ro‘yxatdan o‘tgan sana kiritilishi shart';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const studentData = { ...formData, userRole: 'STUDENT' };
      if (isEditMode && editData) {
        await axios.put(`${STUDENTS_URL}/${editData.id}`, studentData);
      } else {
        await axios.post(STUDENTS_URL, studentData);
      }
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(isEditMode ? 'O‘quvchini yangilashda xatolik:' : 'O‘quvchi qo‘shishda xatolik:', error);
      setErrors({ submit: error.response?.data?.message || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ConfigProvider>
      <Modal
        title={isEditMode ? "O'quvchini tahrirlash" : "O'quvchi qo'shish"}
        open={isOpen}
        onOk={handleSubmit}
        onCancel={handleClose}
        confirmLoading={loading}
        footer={[
          <Button key="cancel" onClick={handleClose}>Bekor qilish</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            {isEditMode ? "Yangilash" : "Qo'shish"}
          </Button>
        ]}
      >
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">To‘liq ism *</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Azizbek Alsiherov"
              className="!py-2 !px-3 rounded-md"
              status={errors.name ? 'error' : ''}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="azizbek@example.com"
              className="!py-2 !px-3 rounded-md"
              status={errors.email ? 'error' : ''}
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Telefon raqam *</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+998901234567"
              className="!py-2 !px-3 rounded-md"
              status={errors.phone ? 'error' : ''}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ro‘yxatdan o‘tgan sana *</label>
            <DatePicker
              style={{ width: '100%' }}
              className="!py-2 !px-3 rounded-md"
              value={formData.enrollmentDate ? dayjs(formData.enrollmentDate) : null}
              onChange={(date, dateString) => setFormData(prev => ({ ...prev, enrollmentDate: dateString }))}
              status={errors.enrollmentDate ? 'error' : ''}
              format="YYYY-MM-DD"
            />
            {errors.enrollmentDate && <p className="mt-1 text-sm text-red-400">{errors.enrollmentDate}</p>}
          </div>

          {/* Courses */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Kurslar</label>
            <div className="space-y-2 max-h-32 overflow-y-auto p-2 border border-gray-700 rounded-md">
              {availableCourses.map((course) => (
                <label key={course.id} className="flex items-center space-x-2 cursor-pointer text-gray-300">
                  <Checkbox
                    checked={formData.courses.includes(course.id)}
                    onChange={() => handleCourseChange(course.id)}
                  />
                  <span className="text-sm">{course.name} - {course.fee} so'm</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">
              {errors.submit}
            </div>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalStudents;
