import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viewMode: "2d",
  resolution: 400,
  hypsometricTinting: true,
  hypsometricRanges: [
    { name: "Deep Water", start: 0, end: 50, color: "#00008B" },
    { name: "Shallow Water", start: 51, end: 84, color: "#4169E1" },
    { name: "Lowlands", start: 85, end: 127, color: "#228B22" },
    { name: "Midlands", start: 128, end: 169, color: "#90EE90" },
    { name: "Highlands", start: 170, end: 211, color: "#F0E68C" },
    { name: "Mountains", start: 212, end: 255, color: "#A0522D" },
  ],
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setResolution: (state, action) => {
      state.resolution = action.payload;
    },
    toggleHypsometricTinting: (state) => {
      state.hypsometricTinting = !state.hypsometricTinting;
    },
    setHypsometricRanges: (state, action) => {
      state.hypsometricRanges = action.payload;
    },
    updateHypsometricRangeColor: (state, action) => {
      const { index, color } = action.payload;
      if (index >= 0 && index < state.hypsometricRanges.length) {
        state.hypsometricRanges[index].color = color;
      }
    },
  },
});

export const {
  setViewMode,
  setResolution,
  toggleHypsometricTinting,
  setHypsometricRanges,
  updateHypsometricRangeColor,
} = settingsSlice.actions;
export default settingsSlice.reducer;
