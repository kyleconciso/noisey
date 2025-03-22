// src/components/LayerControls.jsx (Modified for consistent button colors)
import React from "react";
import { useDispatch } from "react-redux";
import {
  updateLayer,
  deleteLayer,
  toggleLayerVisibility,
  addLayer,
} from "../store/layersSlice";
import {
  Box,
  Typography,
  Slider,
  IconButton,
  TextField,
  Grid,
  Paper,
  Tooltip,
  Divider,
  useTheme,
  alpha,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TuneIcon from "@mui/icons-material/Tune";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LayersIcon from "@mui/icons-material/Layers";

const LayerControls = ({ layer }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleUpdate = (updates) => {
    dispatch(updateLayer({ id: layer.id, updates }));
  };

  const handleDelete = () => {
    dispatch(deleteLayer(layer.id));
  };

  const handleToggleVisibility = () => {
    dispatch(toggleLayerVisibility(layer.id));
  };

  const handleDuplicate = () => {
    const newLayer = {
      ...layer,
      id: Date.now(),
      name: `${layer.name} (Copy)`,
    };
    dispatch(addLayer(newLayer));
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2, // Reduced padding here
        mb: 2, // Reduced margin here
        borderRadius: theme.shape.borderRadius * 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Grid container spacing={1}>
        {/* Reduced spacing between grid items */}
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 0.5 }} // Reduced margin
        >
          <Box display="flex" alignItems="center">
            <TuneIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography
              variant="h6"
              fontWeight="500"
              sx={{ fontSize: "1rem", color: theme.palette.text.primary }}
            >
              {layer.name}
            </Typography>
          </Box>
          <Box>
            <Tooltip title={layer.visible ? "Hide Layer" : "Show Layer"}>
              <IconButton
                onClick={handleToggleVisibility}
                size="small"
                //color={layer.visible ? "primary" : "default"} Removed
                sx={{
                  mr: 1,
                  color: theme.palette.primary.main, // Consistent color
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1), // Add hover effect
                  },
                }} // Reduced margin
              >
                {layer.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Duplicate Layer">
              <IconButton
                onClick={handleDuplicate}
                size="small"
                sx={{
                  color: theme.palette.primary.main, // Use primary color
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1), // Use primary color for hover
                  },
                  mr: 1, // Reduced margin
                }}
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Layer">
              <IconButton
                onClick={handleDelete}
                size="small"
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mb: 1 }} /> {/* Reduced margin */}
        </Grid>

        {/* Seed (Moved to top) */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            fontWeight="500"
            gutterBottom
            color="text.secondary"
          >
            Seed
          </Typography>
          <TextField
            type="number"
            value={layer.seed}
            onChange={(e) =>
              handleUpdate({ seed: parseInt(e.target.value) || 0 })
            }
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              sx: {
                borderRadius: theme.shape.borderRadius * 1.5,
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                padding: "4px 8px", // Reduced padding
                height: "32px",
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="body2"
            fontWeight="500"
            gutterBottom
            id={`scale-slider-${layer.id}`}
            color="text.secondary"
            sx={{ mb: -0.5 }} // Negative margin to pull slider closer
          >
            Scale
          </Typography>
          <Slider
            value={layer.scale}
            min={1}
            max={100}
            step={1}
            onChange={(event, value) => handleUpdate({ scale: value })}
            valueLabelDisplay="auto"
            aria-labelledby={`scale-slider-${layer.id}`}
            sx={{
              color: theme.palette.primary.main,
              height: 2, // Reduced height
              "& .MuiSlider-thumb": {
                width: 12, // Reduced thumb size
                height: 12,
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body2"
            fontWeight="500"
            gutterBottom
            id={`octaves-slider-${layer.id}`}
            color="text.secondary"
            sx={{ mb: -0.5 }}
          >
            Octaves
          </Typography>
          <Slider
            value={layer.octaves}
            min={1}
            max={8}
            step={1}
            onChange={(event, value) => handleUpdate({ octaves: value })}
            valueLabelDisplay="auto"
            aria-labelledby={`octaves-slider-${layer.id}`}
            sx={{
              color: theme.palette.primary.main,
              height: 2,
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body2"
            fontWeight="500"
            gutterBottom
            id={`persistence-slider-${layer.id}`}
            color="text.secondary"
            sx={{ mb: -0.5 }}
          >
            Persistence
          </Typography>
          <Slider
            value={layer.persistence * 100}
            min={0}
            max={100}
            step={1}
            onChange={(event, value) =>
              handleUpdate({ persistence: value / 100 })
            }
            valueLabelDisplay="auto"
            aria-labelledby={`persistence-slider-${layer.id}`}
            sx={{
              color: theme.palette.primary.main,
              height: 2,
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body2"
            fontWeight="500"
            gutterBottom
            id={`lacunarity-slider-${layer.id}`}
            color="text.secondary"
            sx={{ mb: -0.5 }}
          >
            Lacunarity
          </Typography>
          <Slider
            value={layer.lacunarity * 100}
            min={100}
            max={300}
            step={1}
            onChange={(event, value) =>
              handleUpdate({ lacunarity: value / 100 })
            }
            valueLabelDisplay="auto"
            aria-labelledby={`lacunarity-slider-${layer.id}`}
            sx={{
              color: theme.palette.primary.main,
              height: 2,
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
              },
            }}
          />
        </Grid>

        {/* Bias */}
        <Grid item xs={12}>
          <Typography
            variant="body2"
            fontWeight="500"
            gutterBottom
            id={`bias-slider-${layer.id}`}
            color="text.secondary"
            sx={{ mb: -0.5 }}
          >
            Bias
          </Typography>
          <Slider
            value={layer.bias * 100}
            min={-100}
            max={100}
            step={1}
            onChange={(event, value) => handleUpdate({ bias: value / 100 })}
            valueLabelDisplay="auto"
            aria-labelledby={`bias-slider-${layer.id}`}
            sx={{
              color: theme.palette.primary.main,
              height: 2,
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
              },
            }}
          />
        </Grid>

        {/* Blend Mode */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel
              id={`blend-mode-label-${layer.id}`}
              sx={{
                fontSize: "0.8rem",
              }}
            >
              Blend Mode
            </InputLabel>
            <Select
              labelId={`blend-mode-label-${layer.id}`}
              value={layer.blendMode}
              label="Blend Mode"
              onChange={(event) =>
                handleUpdate({ blendMode: event.target.value })
              }
              sx={{
                borderRadius: theme.shape.borderRadius * 1.5,
                fontSize: "0.8rem",
                "& .MuiSelect-select": {
                  py: 0.5,
                },
              }}
            >
              <MenuItem value="normal" sx={{ fontSize: "0.8rem" }}>
                Normal
              </MenuItem>
              <MenuItem value="add" sx={{ fontSize: "0.8rem" }}>
                Add
              </MenuItem>
              <MenuItem value="subtract" sx={{ fontSize: "0.8rem" }}>
                Subtract
              </MenuItem>
              <MenuItem value="multiply" sx={{ fontSize: "0.8rem" }}>
                Multiply
              </MenuItem>
              <MenuItem value="screen" sx={{ fontSize: "0.8rem" }}>
                Screen
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="body2"
            fontWeight="500"
            gutterBottom
            id={`weight-slider-${layer.id}`}
            color="text.secondary"
            sx={{ mb: -0.5 }}
          >
            Weight
          </Typography>
          <Slider
            value={layer.weight * 100}
            min={0}
            max={100}
            step={1}
            onChange={(event, value) => handleUpdate({ weight: value / 100 })}
            valueLabelDisplay="auto"
            aria-labelledby={`weight-slider-${layer.id}`}
            sx={{
              color: theme.palette.primary.main,
              height: 2,
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
              },
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LayerControls;
