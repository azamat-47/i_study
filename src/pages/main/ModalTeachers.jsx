import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider, Modal, Input, Select } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const ModalTeachers = ({ isOpen, onClose, onSuccess, editData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userRole: 'TEACHER'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = 'https://lms-production-94cb.up.railway.app';
  const TEACHERS_URL = `${API_BASE_URL}/teachers`;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editData) {
        setFormData({
          name: editData.name || '',
          email: editData.email || '',
          phone: editData.phone || '',
          userRole: editData.userRole || 'TEACHER'
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
      userRole: 'TEACHER'
    });
    setErrors({});
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Ism kiritilishi shart';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'To‘g‘ri email formatini kiriting';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqam kiritilishi shart';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'To‘g‘ri telefon raqam formatini kiriting';
    }
    if (!formData.userRole) newErrors.userRole = 'Lavozim tanlanishi shart';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isEditMode && editData) {
        await axios.put(`${TEACHERS_URL}/${editData.id}`, formData);
      } else {
        await axios.post(TEACHERS_URL, formData);
      }
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('O‘qituvchi qo‘shishda xatolik:', error);
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
        title={isEditMode ? "O‘qituvchi tahrirlash" : "O‘qituvchi qo‘shish"}
        open={isOpen}
        onOk={handleSubmit}
        onCancel={handleClose}
        confirmLoading={loading}
        footer={[
          <Button key="cancel" onClick={handleClose}>Bekor qilish</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            {isEditMode ? 'Tahrirlash' : "Qo‘shish"}
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

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lavozim *</label>
            <Select
              value={formData.userRole}
              onChange={(value) => setFormData(prev => ({ ...prev, userRole: value }))}
              status={errors.userRole ? 'error' : ''}
              style={{ width: '100%' }}
              className="rounded-md"
            >
              <Option value="TEACHER">O‘qituvchi</Option>
              <Option value="ADMIN">Administrator</Option>
            </Select>
            {errors.userRole && <p className="mt-1 text-sm text-red-400">{errors.userRole}</p>}
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

export default ModalTeachers;
