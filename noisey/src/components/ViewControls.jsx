import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setViewMode,
  setResolution,
  toggleHypsometricTinting,
} from "../store/settingsSlice";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

const ViewControls = () => {
  const dispatch = useDispatch();
  const { viewMode, resolution, hypsometricTinting } = useSelector(
    (state) => state.settings
  );

  const handleViewModeChange = (event) => {
    dispatch(setViewMode(event.target.value));
  };

  const handleResolutionChange = (event, newValue) => {
    dispatch(setResolution(newValue));
  };

  const handleHypsometricToggle = (event) => {
    dispatch(toggleHypsometricTinting());
  };

  return (
    <Box>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="view-mode-label">View Mode</InputLabel>
        <Select
          labelId="view-mode-label"
          id="view-mode-select"
          value={viewMode}
          label="View Mode"
          onChange={handleViewModeChange}
        >
          <MenuItem value="2d">2D</MenuItem>
          <MenuItem value="3d">3D</MenuItem>
        </Select>
      </FormControl>

      <Typography id="resolution-slider" gutterBottom>
        Resolution
      </Typography>
      <Tooltip
        title={
          <span>
            Resolution: {resolution}x{resolution}
          </span>
        }
        placement="bottom"
      >
        <Slider
          value={resolution}
          min={100}
          max={800}
          step={1}
          onChange={handleResolutionChange}
          valueLabelDisplay="auto"
          aria-labelledby="resolution-slider"
        />
      </Tooltip>
    </Box>
  );
};

export default ViewControls;
