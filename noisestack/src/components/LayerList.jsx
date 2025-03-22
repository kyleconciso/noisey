// src/components/LayerList.jsx (Modified for text field within ListItemButton)
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addLayer,
  setSelectedLayerId,
  clearSelectedLayerId,
  deleteLayer,
  toggleLayerVisibility,
  moveLayer,
  updateLayer,
} from "../store/layersSlice";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Box,
  Typography,
  Paper,
  Button,
  Tooltip,
  useTheme,
  alpha,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LayersIcon from "@mui/icons-material/Layers";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

// CORRECT: SortableItem is a separate component
const SortableItem = ({
  layer,
  selectedLayerId,
  handleLayerSelect,
  handleDoubleClick,
  editLayerId,
  tempName,
  handleNameChange,
  handleNameBlur,
  handleNameKeyDown,
  handleToggleVisibility,
  handleDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const theme = useTheme(); //  CALL useTheme here

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 1 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      component={Paper}
      elevation={selectedLayerId === layer.id ? 3 : 1}
      sx={{
        mb: 1.5,
        p: 0,
        borderRadius: theme.shape.borderRadius * 1.5, // Corrected: Use theme here
        transition: theme.transitions.create(
          // Corrected: Use theme here
          ["box-shadow", "background-color"],
          {
            duration: theme.transitions.duration.short,
          }
        ),
        border:
          selectedLayerId === layer.id
            ? `1px solid ${alpha(theme.palette.primary.main, 0.5)}` // Corrected: Use theme here
            : `1px solid ${alpha(theme.palette.divider, 0.1)}`, // Corrected: Use theme here
        backgroundColor:
          selectedLayerId === layer.id
            ? alpha(theme.palette.primary.main, 0.05) // Corrected: Use theme here
            : theme.palette.background.paper, // Corrected: Use theme here
        overflow: "hidden",
      }}
    >
      <ListItemButton
        onClick={() => handleLayerSelect(layer.id)}
        onDoubleClick={() => handleDoubleClick(layer.id, layer.name)}
        sx={{
          py: 1,
          "&:hover": {
            backgroundColor:
              selectedLayerId === layer.id
                ? alpha(theme.palette.primary.main, 0.1) // Corrected: Use theme here
                : theme.palette.action.hover, // Corrected: Use theme here
          },
          //display: "flex", // Removed, not necessary.
          width: "100%", // Ensure it takes the full width
        }}
      >
        <IconButton
          {...attributes}
          {...listeners}
          size="small"
          sx={{
            mr: 1,
            color: theme.palette.action.disabled, // Corrected: Use theme here
          }}
        >
          <DragIndicatorIcon />
        </IconButton>

        {editLayerId === layer.id ? (
          <TextField
            value={tempName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            autoFocus
            size="small"
            sx={{
              width: "60%", // Adjusted width
            }}
            inputProps={{
              style: {
                padding: 0, // Remove padding to align with ListItemText
                fontSize: "0.85rem",
              },
            }}
            variant="standard" // No border when editing.
          />
        ) : (
          <ListItemText
            primary={
              <Typography
                variant="body1"
                fontWeight={selectedLayerId === layer.id ? 500 : 400}
                sx={{
                  color:
                    selectedLayerId === layer.id
                      ? theme.palette.primary.main // Corrected: Use theme here
                      : theme.palette.text.primary, // Corrected: Use theme here
                  fontSize: "0.85rem",
                  ml: 0, // Remove default margin
                }}
              >
                {layer.name}
              </Typography>
            }
          />
        )}

        <ListItemSecondaryAction sx={{ right: 8 }}>
          <Tooltip title={layer.visible ? "Hide Layer" : "Show Layer"}>
            <IconButton
              edge="end"
              onClick={(e) => handleToggleVisibility(e, layer.id)}
              size="small"
              // Removed color prop
              sx={{
                mr: 1,
                color: theme.palette.primary.main, // Consistent color
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1), // Add hover effect
                },
              }}
            >
              {layer.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Layer">
            <IconButton
              edge="end"
              onClick={(e) => handleDelete(e, layer.id)}
              size="small"
              sx={{
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.error.main, 0.1), // Add hover effect
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItemButton>
    </ListItem>
  );
};

const LayerList = () => {
  const dispatch = useDispatch();
  const layers = useSelector((state) => state.layers.layers);
  const selectedLayerId = useSelector((state) => state.layers.selectedLayerId);
  const theme = useTheme();
  const [editLayerId, setEditLayerId] = useState(null);
  const [tempName, setTempName] = useState("");

  // ... (rest of your handler functions: handleAddLayer, handleLayerSelect, etc.) ...
  const handleAddLayer = () => {
    dispatch(
      addLayer({
        id: Date.now(),
        name: `Layer ${layers.length + 1}`,
        scale: 20,
        octaves: 3,
        persistence: 0.5,
        lacunarity: 2.0,
        seed: Math.floor(Math.random() * 1000),
        weight: 0.5,
        visible: true,
        bias: 0, // Add bias
        blendMode: "normal", // Add blendMode
      })
    );
  };

  const handleLayerSelect = (layerId) => {
    if (selectedLayerId === layerId) {
      dispatch(clearSelectedLayerId());
    } else {
      dispatch(setSelectedLayerId(layerId));
    }
    setEditLayerId(null); // Exit edit mode if clicking a different layer
    setTempName("");
  };

  const handleDelete = (e, layerId) => {
    e.stopPropagation();
    dispatch(deleteLayer(layerId));
    setEditLayerId(null); // Exit edit mode if deleting
    setTempName("");
  };

  const handleToggleVisibility = (e, layerId) => {
    e.stopPropagation();
    dispatch(toggleLayerVisibility(layerId));
  };

  const handleDoubleClick = (layerId, layerName) => {
    setEditLayerId(layerId);
    setTempName(layerName);
  };

  const handleNameChange = (e) => {
    setTempName(e.target.value);
  };

  const handleNameBlur = () => {
    if (tempName.trim() !== "") {
      dispatch(updateLayer({ id: editLayerId, updates: { name: tempName } }));
    }
    setEditLayerId(null);
    setTempName("");
  };

  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNameBlur();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = layers.findIndex((layer) => layer.id === active.id);
      const newIndex = layers.findIndex((layer) => layer.id === over.id);
      dispatch(moveLayer({ oldIndex, newIndex }));
    }
    setEditLayerId(null);
    setTempName("");
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography
          variant="h6"
          fontWeight="500"
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
          }}
        >
          <LayersIcon
            sx={{
              mr: 1,
              color: theme.palette.primary.main,
            }}
          />
          Layers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddLayer}
          sx={{
            borderRadius: theme.shape.borderRadius * 1.5,
            boxShadow: theme.shadows[2],
            textTransform: "none",
            fontSize: "0.8rem",
            padding: "4px 12px",
          }}
        >
          Add Layer
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={layers.map((layer) => layer.id)}
          strategy={verticalListSortingStrategy}
        >
          <List sx={{ mb: 1 }}>
            {layers.map((layer) => (
              <SortableItem
                key={layer.id}
                layer={layer} // Pass the layer data
                selectedLayerId={selectedLayerId} // Pass other props
                handleLayerSelect={handleLayerSelect}
                handleDoubleClick={handleDoubleClick}
                editLayerId={editLayerId}
                tempName={tempName}
                handleNameChange={handleNameChange}
                handleNameBlur={handleNameBlur}
                handleNameKeyDown={handleNameKeyDown}
                handleToggleVisibility={handleToggleVisibility}
                handleDelete={handleDelete}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
      {layers.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2, // Reduced padding
            textAlign: "center",
            border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
            borderRadius: theme.shape.borderRadius * 1.5,
          }}
        >
          <LayersIcon
            sx={{
              fontSize: 32, // Reduced icon size
              color: alpha(theme.palette.text.secondary, 0.5),
              mb: 0.5, // Reduced margin
            }}
          />
          <Typography variant="body2" color="text.secondary">
            No layers available
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddLayer}
            sx={{
              mt: 1, // Reduced margin
              borderRadius: theme.shape.borderRadius * 1.5,
              textTransform: "none",
              fontSize: "0.8rem", // Reduced font size
              padding: "4px 12px", // Reduced padding
            }}
          >
            Add Your First Layer
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default LayerList;
