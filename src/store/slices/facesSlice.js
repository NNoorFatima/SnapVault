import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  faces: [], // Array of face objects or image data
  loading: false,
  error: null,
};

const facesSlice = createSlice({
  name: 'faces',
  initialState,
  reducers: {
    setFaces(state, action) {
      state.faces = action.payload;
    },
    addFace(state, action) {
      state.faces.push(action.payload);
    },
    removeFace(state, action) {
      state.faces = state.faces.filter(face => face.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearFaces(state) {
      state.faces = [];
    },
  },
});

export const { setFaces, addFace, removeFace, setLoading, setError, clearFaces } = facesSlice.actions;
export default facesSlice.reducer;
