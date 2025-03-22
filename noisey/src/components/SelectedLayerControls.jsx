import React from "react";
import { useSelector } from "react-redux";
import LayerControls from "./LayerControls";
import { Box, Typography } from "@mui/material";

const SelectedLayerControls = () => {
  const selectedLayerId = useSelector((state) => state.layers.selectedLayerId);
  const layers = useSelector((state) => state.layers.layers);
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId);

  return (
    <Box mt={4}>
      {selectedLayer ? (
        <LayerControls layer={selectedLayer} />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={2}
        >
          No layer selected. Select a layer to view its controls.
        </Typography>
      )}
    </Box>
  );
};

export default SelectedLayerControls;
