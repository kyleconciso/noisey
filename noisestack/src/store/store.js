import { configureStore } from "@reduxjs/toolkit";
import layersReducer from "./layersSlice";
import settingsReducer from "./settingsSlice";

const store = configureStore({
  reducer: {
    layers: layersReducer,
    settings: settingsReducer,
  },
});

export default store;
