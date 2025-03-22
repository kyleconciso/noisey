import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layers: [
    {
      id: 1,
      name: "Base Layer",
      scale: 30,
      octaves: 4,
      persistence: 0.5,
      lacunarity: 2.0,
      seed: 42,
      weight: 1.0,
      visible: true,
      bias: 0,
      blendMode: "normal",
    },
  ],
  selectedLayerId: null,
};

const layersSlice = createSlice({
  name: "layers",
  initialState,
  reducers: {
    addLayer: (state, action) => {
      state.layers.push(action.payload);
    },
    deleteLayer: (state, action) => {
      const layerId = action.payload;
      state.layers = state.layers.filter((layer) => layer.id !== layerId);

      if (state.selectedLayerId === layerId) {
        state.selectedLayerId = null;
      }
    },
    updateLayer: (state, action) => {
      const { id, updates } = action.payload;
      const layerIndex = state.layers.findIndex((layer) => layer.id === id);
      if (layerIndex !== -1) {
        state.layers[layerIndex] = { ...state.layers[layerIndex], ...updates };
      }
    },
    toggleLayerVisibility: (state, action) => {
      const layerId = action.payload;
      const layer = state.layers.find((layer) => layer.id === layerId);
      if (layer) {
        layer.visible = !layer.visible;
      }
    },
    setLayers: (state, action) => {
      state.layers = action.payload.layers;
      state.selectedLayerId = null;
    },
    setSelectedLayerId: (state, action) => {
      state.selectedLayerId = action.payload;
    },
    clearSelectedLayerId: (state) => {
      state.selectedLayerId = null;
    },
    moveLayer: (state, action) => {
      const { oldIndex, newIndex } = action.payload;
      state.layers = arrayMove(state.layers, oldIndex, newIndex);
    },
  },
});

export const {
  addLayer,
  deleteLayer,
  updateLayer,
  toggleLayerVisibility,
  setLayers,
  setSelectedLayerId,
  clearSelectedLayerId,
  moveLayer,
} = layersSlice.actions;
export default layersSlice.reducer;

function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );
  return newArray;
}
