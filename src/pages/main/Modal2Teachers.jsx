import React, { useState, useEffect } from 'react';
import { Button, ConfigProvider, Modal, Space } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import axios from 'axios';

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

const Modal2Teachers = ({ isOpen, onClose, onSuccess }) => {
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { styles } = useStyle();
  const token = useTheme();

  const API_BASE_URL = 'https://lms-production-94cb.up.railway.app';
  const TEACHERS_URL = `${API_BASE_URL}/teachers`;
  const GROUPS_URL = `${API_BASE_URL}/courses`;

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersResponse, groupsResponse] = await Promise.all([
        axios.get(TEACHERS_URL),
        axios.get(GROUPS_URL)
      ]);
      setTeachers(teachersResponse.data);
      setGroups(groupsResponse.data);
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
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
        title="O'qituvchilar va guruhlarni biriktirish"
        open={isOpen}
        onOk={handleClose}
        onCancel={handleClose}
        width={1000}
        footer={[
          <Button key="close" onClick={handleClose}>
            Yopish
          </Button>
        ]}
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-lg">Yuklanmoqda...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teachers Section */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                O'qituvchilar
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <div key={teacher.id} className="bg-gray-600 rounded-md p-3 hover:bg-gray-650 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">
                            {formatValue(teacher.name)}
                          </h4>
                          <p className="text-gray-300 text-xs mt-1">
                            {formatRole(teacher.userRole)}
                          </p>
                          {teacher.email && (
                            <p className="text-gray-400 text-xs mt-1">
                              {teacher.email}
                            </p>
                          )}
                        </div>
                        <Button 
                          type="link" 
                          size="small"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Tanlash
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-sm py-8">
                    Hali o'qituvchi qo'shilmagan
                  </div>
                )}
              </div>
            </div>

            {/* Groups Section */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                Guruhlar
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <div key={group.id} className="bg-gray-600 rounded-md p-3 hover:bg-gray-650 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">
                            {formatValue(group.name)}
                          </h4>
                          {group.description && (
                            <p className="text-gray-300 text-xs mt-1">
                              {group.description}
                            </p>
                          )}
                          {group.fee && (
                            <p className="text-green-400 text-xs mt-1">
                              {group.fee} so'm
                            </p>
                          )}
                        </div>
                        <Button 
                          type="link" 
                          size="small"
                          className="text-green-400 hover:text-green-300"
                        >
                          Tanlash
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-sm py-8">
                    Hali guruh qo'shilmagan
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Linking Section */}
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-600 pb-2">
            Biriktirish
          </h3>
          <div className="bg-gray-600 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-300 text-sm">
                  <span className="text-blue-400">O'qituvchi:</span> 
                  <span className="ml-2 text-white">Tanlanmagan</span>
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  <span className="text-green-400">Guruh:</span> 
                  <span className="ml-2 text-white">Tanlanmagan</span>
                </p>
              </div>
              <Button 
                type="primary"
                disabled={true}
              >
                Biriktirish
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default Modal2Teachers;
