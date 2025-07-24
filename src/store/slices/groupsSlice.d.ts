import { createAsyncThunk } from '@reduxjs/toolkit';

export interface GroupData {
  id: number;
  name: string;
  invite_code: string;
  created_at: string;
  description?: string;
  creator: {
    id: number;
    name: string;
    email: string;
    bio?: string;
    created_at: string;
    profile_picture?: string;
  };
}

export interface CreateGroupData {
  name: string;
  description: string;
}

export interface JoinGroupData {
  invite_code: string;
}

export interface GroupsState {
  data: GroupData[];
  currentGroup: GroupData | null;
  searchResults: GroupData[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export declare const fetchGroups: ReturnType<typeof createAsyncThunk<GroupData[], any, any>>;
export declare const createGroup: ReturnType<typeof createAsyncThunk<GroupData, CreateGroupData, any>>;
export declare const joinGroup: ReturnType<typeof createAsyncThunk<any, JoinGroupData, any>>;
export declare const leaveGroup: ReturnType<typeof createAsyncThunk<any, number, any>>;
export declare const getGroupDetails: ReturnType<typeof createAsyncThunk<GroupData, number, any>>;
export declare const updateGroup: ReturnType<typeof createAsyncThunk<GroupData, { groupId: number; groupData: Partial<CreateGroupData> }, any>>;
export declare const deleteGroup: ReturnType<typeof createAsyncThunk<any, number, any>>;
export declare const searchGroups: ReturnType<typeof createAsyncThunk<GroupData[], any, any>>;

export declare const groupsSlice: {
  reducer: any;
  actions: {
    resetGroups: () => any;
    clearError: () => any;
    setCurrentGroup: (payload: GroupData) => any;
    clearSearchResults: () => any;
    removeGroupFromList: (payload: number) => any;
    addGroupToList: (payload: GroupData) => any;
    updateGroupInList: (payload: GroupData) => any;
  };
}; 