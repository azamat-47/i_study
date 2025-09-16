import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Get all groups by branch
const getGroupsByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/groups?branchId=${branchId}`);
  return response.data;
};

// Get group by ID
const getGroupById = async ({ queryKey }) => {
  const [, groupId] = queryKey;
  const response = await API.get(`/groups/${groupId}`);
  return response.data;
};

// Create Group
const createGroup = async (payload) => {
  if (!payload.name || !payload.courseId || !payload.teacherId || !payload.branchId || !payload.startTime || !payload.endTime) {
    throw new Error("Guruh nomi, kurs, o'qituvchi, filial, boshlanish va tugash vaqti majburiy.");
  }

  const body = {
    ...payload,
    studentIds: payload.studentIds || [],
    daysOfWeek: payload.daysOfWeek || []
  };

  const response = await API.post('/groups', body);
  return response.data;
};

// Update Group
const updateGroup = async ({ id, payload }) => {
  if (!payload.name || !payload.courseId || !payload.teacherId || !payload.branchId || !payload.startTime || !payload.endTime) {
    throw new Error("Guruh nomi, kurs, o'qituvchi, filial, boshlanish va tugash vaqti majburiy.");
  }

  const body = {
    ...payload,
    studentIds: payload.studentIds || [],
    daysOfWeek: payload.daysOfWeek || []
  };

  const response = await API.put(`/groups/${id}`, body);
  return response.data;
};

// Delete Group
const deleteGroup = async (id) => {
  const response = await API.delete(`/groups/${id}`);
  return response.data;
};

// Get Unpaid Students by Group
const getUnpaidStudentsByGroup = async ({ queryKey }) => {
  const [, groupId, year, month] = queryKey;
  const response = await API.get(`/groups/${groupId}/unpaid-students${year ? `?year=${year}` : ''}${month ? `&month=${month}` : ''}`);
  return response.data;
};

// useGroups hook
export const useGroups = (branchId) => {
  const queryClient = useQueryClient();

  // Get all groups for a branch
  const groupsQuery = useQuery({
    queryKey: ['groups', branchId],
    queryFn: getGroupsByBranch,
    enabled: !!branchId,
  });

  // Get a single group by ID
  const groupByIdQuery = (groupId) => useQuery({
    queryKey: ['group', groupId],
    queryFn: getGroupById,
    enabled: !!groupId,
  });

  // Create Group
  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onMutate: () => {
      toast.loading("Guruh qo'shilmoqda...", { id: "createGroup" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      toast.success("Guruh muvaffaqiyatli qo'shildi!", { id: "createGroup" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Guruh qo'shishda xatolik yuz berdi.", { id: "createGroup" });
    }
  });

  // Update Group
  const updateGroupMutation = useMutation({
    mutationFn: updateGroup,
    onMutate: () => {
      toast.loading("Guruh yangilanmoqda...", { id: "updateGroup" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['group', data.id] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      toast.success("Guruh muvaffaqiyatli yangilandi!", { id: "updateGroup" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Guruhni yangilashda xatolik yuz berdi.", { id: "updateGroup" });
    }
  });

  // Delete Group
  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onMutate: () => {
      toast.loading("Guruh o'chirilmoqda...", { id: "deleteGroup" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      toast.success("Guruh muvaffaqiyatli o'chirildi!", { id: "deleteGroup" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Guruhni o'chirishda xatolik yuz berdi.", { id: "deleteGroup" });
    }
  });

  // Get Unpaid Students by Group
  const unpaidStudentsByGroupQuery = (groupId, year, month) => useQuery({
    queryKey: ['unpaid-students-by-group', groupId, year, month],
    queryFn: getUnpaidStudentsByGroup,
    enabled: !!groupId,
  });

  return {
    groupsQuery,
    groupByIdQuery,
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    unpaidStudentsByGroupQuery,
  };
};
