// src/components/ColorPaletteControls.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setHypsometricRanges,
  updateHypsometricRangeColor,
  toggleHypsometricTinting,
} from "../store/settingsSlice";

import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";

const ColorPaletteControls = () => {
  const dispatch = useDispatch();
  const { hypsometricTinting, hypsometricRanges } = useSelector(
    (state) => state.settings
  );

  const handleColorChange = (index, color) => {
    dispatch(updateHypsometricRangeColor({ index, color }));
  };

  const handleToggleTinting = () => {
    dispatch(toggleHypsometricTinting());
  };

  return (
    <Box sx={{ p: 2, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Color Palette
      </Typography>
      <FormControlLabel
        control={
          <Switch checked={hypsometricTinting} onChange={handleToggleTinting} />
        }
        label="Color by Height"
      />
      <Divider sx={{ my: 1 }} />

      {hypsometricTinting && (
        <List>
          {hypsometricRanges.map((range, index) => (
            <ListItem key={index} divider>
              <TextField
                label="Name"
                value={range.name}
                disabled // No range edition yet.
                variant="outlined"
                size="small"
                sx={{ mr: 1, width: "40%" }}
              />
              <TextField
                label="Start"
                type="number"
                value={range.start}
                disabled // No range edition yet.
                variant="outlined"
                size="small"
                sx={{ mr: 1, width: "20%" }}
              />
              <TextField
                label="End"
                type="number"
                value={range.end}
                disabled // No range edition yet.
                variant="outlined"
                size="small"
                sx={{ mr: 1, width: "20%" }}
              />
              <TextField
                type="color"
                value={range.color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                variant="outlined"
                size="small"
                sx={{ width: "20%" }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ColorPaletteControls;
