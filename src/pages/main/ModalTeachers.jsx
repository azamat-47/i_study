import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider, Modal, Space, Input, Select } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import axios from 'axios';

const { Option } = Select;

const useStyle = createStyles(({ token }) => ({
  'my-modal-body': {
    background: token.blue1,
    padding: token.paddingSM,
  },
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-header': {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  'my-modal-footer': {
    color: token.colorPrimary,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

const ModalTeachers = ({ isOpen, onClose, onSuccess, editData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userRole: 'TEACHER'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { styles } = useStyle();
  const token = useTheme();

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ism kiritilishi shart';
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'To\'g\'ri email formatini kiriting';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon raqam kiritilishi shart';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'To\'g\'ri telefon raqam formatini kiriting';
    }

    if (!formData.userRole) {
      newErrors.userRole = 'Lavozim tanlanishi shart';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editData) {
        await axios.put(`${TEACHERS_URL}/${editData.id}`, formData);
      } else {
        await axios.post(TEACHERS_URL, formData);
      }
      
      // Reset form
      resetForm();
      setErrors({});
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('O\'qituvchi qo\'shishda xatolik:', error);
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const classNames = {
    body: styles['my-modal-body'],
    mask: styles['my-modal-mask'],
    header: styles['my-modal-header'],
    footer: styles['my-modal-footer'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    header: {
      borderInlineStart: `5px solid ${token.colorPrimary}`,
      borderRadius: 0,
      paddingInlineStart: 5,
    },
    body: {
      boxShadow: 'inset 0 0 5px #999',
      borderRadius: 5,
    },
    mask: {
      backdropFilter: 'blur(10px)',
    },
    footer: {
      borderTop: '1px solid #333',
    },
    content: {
      boxShadow: '0 0 30px #999',
    },
  };

  return (
    <ConfigProvider
      modal={{
        classNames,
        styles: modalStyles,
      }}
    >
      <Modal
        title={isEditMode ? "O'qituvchi tahrirlash" : "O'qituvchi qo'shish"}
        open={isOpen}
        onOk={handleSubmit}
        onCancel={handleClose}
        confirmLoading={loading}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Bekor qilish
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loading}
            onClick={handleSubmit}
          >
            {isEditMode ? 'Tahrirlash' : 'Qo\'shish'}
          </Button>
        ]}
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To'liq ism *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Azizbek Alsiherov"
              status={errors.name ? 'error' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="azizbek@example.com"
              status={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Telefon raqam *
            </label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+998901234567"
              status={errors.phone ? 'error' : ''}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lavozim *
            </label>
            <Select
              name="userRole"
              value={formData.userRole}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  userRole: value
                }));
              }}
              status={errors.userRole ? 'error' : ''}
              style={{ width: '100%' }}
            >
              <Option value="TEACHER">O'qituvchi</Option>
              <Option value="ADMIN">Administrator</Option>
            </Select>
            {errors.userRole && (
              <p className="mt-1 text-sm text-red-400">{errors.userRole}</p>
            )}
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