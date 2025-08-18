import React, { useState, useEffect } from "react";
import { Button, ConfigProvider, Modal, Input, InputNumber } from "antd";
import axios from "axios";

const ModalGroups = ({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fee: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = "https://lms-production-94cb.up.railway.app";
  const GROUPS_URL = `${API_BASE_URL}/courses`;

  useEffect(() => {
    // Modal ochilganda, ma'lumotlarni to'ldirish yoki tozalash
    if (isOpen) {
      if (isEditMode && editData) {
        setFormData({
          name: editData.name || "",
          description: editData.description || "",
          fee: editData.fee || null,
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, isEditMode, editData]);

  // Formani tozalash
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      fee: null,
    });
    setErrors({});
  };

  // Input o'zgarishlarini kuzatish
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Xatolikni tozalash
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Narx inputi o'zgarishlarini kuzatish
  const handleFeeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      fee: value,
    }));
    if (errors.fee) {
      setErrors((prev) => ({ ...prev, fee: "" }));
    }
  };

  // Formani tekshirish (validatsiya)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Guruh nomi kiritilishi shart";
    if (formData.fee === null || formData.fee <= 0)
      newErrors.fee = "To'lov miqdori kiritilishi shart";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formani yuborish (submit)
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isEditMode && editData) {
        // Tahrirlash
        await axios.put(`${GROUPS_URL}/${editData.id}`, formData);
      } else {
        // Qo'shish
        await axios.post(GROUPS_URL, formData);
      }
      resetForm();
      onSuccess(); // Muvaffaqiyatli amal haqida xabar berish
      onClose(); // Modalni yopish
    } catch (error) {
      console.error("Guruh saqlashda xatolik:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Xatolik yuz berdi. Qaytadan urinib ko‘ring.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Modalni bekor qilish
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <ConfigProvider>
      <Modal
        title={isEditMode ? "Guruhni tahrirlash" : "Yangi guruh qo'shish"}
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
            {isEditMode ? "Saqlash" : "Qo‘shish"}
          </Button>,
        ]}
      >
      
          <div className="space-y-5 py-4">
            {/* Guruh nomi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guruh nomi *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masalan, Frontend (React)"
                className="!py-2 !px-3 rounded-md"
                status={errors.name ? "error" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Izoh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Izoh
              </label>
              <Input.TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Guruh haqida qisqacha ma'lumot..."
                rows={3}
                className="!py-2 !px-3 rounded-md"
              />
            </div>

            {/* Narxi */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oylik to'lov *
              </label>
              <InputNumber
                value={formData.fee}
                onChange={handleFeeChange}
                placeholder="Masalan, 500000"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }
                parser={(value) =>
                  value.replace(/\s?so'm/g, "").replace(/\s/g, "")
                }
                className="!py-2 !px-3 rounded-md"
                style={{ width: "100%" }} // <<< bu joy muhim
                status={errors.fee ? "error" : ""}
                min={0}
              />
              {errors.fee && (
                <p className="mt-1 text-sm text-red-500 w-full">{errors.fee}</p>
              )}
            </div>

            {/* Submit xatoligi */}
            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {errors.submit}
              </div>
            )}
          </div>
        
      </Modal>
    </ConfigProvider>
  );
};

export default ModalGroups;
