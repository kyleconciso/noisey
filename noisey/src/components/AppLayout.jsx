import React, {
  useState,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Drawer,
  Divider,
  Toolbar,
  Typography,
  AppBar,
  Paper,
  Container,
  useTheme,
  Tooltip,
  IconButton,
  Popover,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Snackbar,
  Alert,
  Fade,
  Grid,
} from "@mui/material";
import NoiseVisualization from "../components/NoiseVisualizer";
import LayerList from "./LayerList";
import SelectedLayerControls from "./SelectedLayerControls";
import { setLayers } from "../store/layersSlice";
import {
  setViewMode,
  setResolution as setSettingsResolution,
} from "../store/settingsSlice";

import LayersIcon from "@mui/icons-material/Layers";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import PaletteIcon from "@mui/icons-material/Palette";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import { addLayer, deleteLayer, updateLayer } from "../store/layersSlice";
import store from "../store/store";

import ColorPaletteControls from "./ColorPaletteControls";

const drawerWidth = 280;

const historyReducer = (state, action) => {
  switch (action.type) {
    case "ADD_STATE":
      return {
        past: [...state.past, state.present],
        present: action.payload,
        future: [],
      };
    case "UNDO":
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    case "REDO":
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    default:
      return state;
  }
};

const AppLayout = () => {
  const layers = useSelector((state) => state.layers.layers);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [history, dispatchHistory] = useReducer(historyReducer, {
    past: [],
    present: layers,
    future: [],
  });
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [colorPaletteAnchorEl, setColorPaletteAnchorEl] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [fileHover, setFileHover] = useState(false);

  const isFromHistory = useRef(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleUndo = () => {
    isFromHistory.current = true;
    dispatchHistory({ type: "UNDO" });
  };

  const handleRedo = () => {
    isFromHistory.current = true;
    dispatchHistory({ type: "REDO" });
  };

  useEffect(() => {
    if (isFromHistory.current) {
      dispatch(setLayers({ layers: history.present }));
      isFromHistory.current = false;
    }
  }, [history, dispatch]);

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleColorPaletteClick = (event) => {
    setColorPaletteAnchorEl(event.currentTarget);
  };

  const handleColorPaletteClose = () => {
    setColorPaletteAnchorEl(null);
  };

  const handleHelpOpen = () => {
    setHelpOpen(true);
  };

  const handleHelpClose = () => {
    setHelpOpen(false);
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      dispatch(setViewMode(newViewMode));
    }
  };

  const handleResolutionChange = (event, newValue) => {
    dispatch(setSettingsResolution(newValue));
  };

  const handleKeyDown = useCallback(
    (event) => {
      const ctrlOrCmd = event.ctrlKey || event.metaKey;

      if (ctrlOrCmd && event.key === "z") {
        event.preventDefault();
        handleUndo();
      } else if (ctrlOrCmd && event.shiftKey && event.key === "Z") {
        event.preventDefault();
        handleRedo();
      } else if (ctrlOrCmd && event.key === "d") {
        event.preventDefault();
        const selectedLayerId = store.getState().layers.selectedLayerId;
        const selectedLayer = store
          .getState()
          .layers.layers.find((layer) => layer.id === selectedLayerId);

        if (selectedLayer) {
          const newLayer = {
            ...selectedLayer,
            id: Date.now(),
            name: `${selectedLayer.name} (Copy)`,
          };
          dispatch(addLayer(newLayer));
          dispatchHistory({
            type: "ADD_STATE",
            payload: [...store.getState().layers.layers, newLayer],
          });
        }
      } else if (event.key === "Delete") {
        const selectedLayerId = store.getState().layers.selectedLayerId;
        if (selectedLayerId) {
          dispatch(deleteLayer(selectedLayerId));
          dispatchHistory({
            type: "ADD_STATE",
            payload: store
              .getState()
              .layers.layers.filter((layer) => layer.id !== selectedLayerId),
          });
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (
      !isFromHistory.current &&
      JSON.stringify(layers) !== JSON.stringify(history.present)
    ) {
      dispatchHistory({ type: "ADD_STATE", payload: layers });
    }
  }, [layers, history.present]);

  const saveConfig = () => {
    try {
      const config = JSON.stringify(layers, null, 2);
      const blob = new Blob([config], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "noise-config.json";
      a.click();

      URL.revokeObjectURL(url);
      setSnackbarMessage("Configuration saved successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error saving config", error);
      setSnackbarMessage("Failed to save configuration.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const loadConfig = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedLayers = JSON.parse(e.target.result);
        dispatch(setLayers({ layers: loadedLayers }));
        setSnackbarMessage("Configuration loaded successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error loading configuration:", error);
        setSnackbarMessage("Invalid configuration file.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    reader.onerror = (error) => {
      console.error("File Read Error:", error);
      setSnackbarMessage("Error reading the file");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    };

    reader.readAsText(file);

    event.target.value = null;
    setFileHover(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: theme.shadows[2],
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="500"
            sx={{ flexGrow: 1 }}
          >
            ⛰️ noisey
          </Typography>

          {}
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Tooltip title="Undo (Ctrl/Cmd + Z)">
              <IconButton
                color="inherit"
                onClick={handleUndo}
                disabled={history.past.length === 0}
                size="small"
              >
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo (Ctrl/Cmd + Shift + Z)">
              <IconButton
                color="inherit"
                onClick={handleRedo}
                disabled={history.future.length === 0}
                size="small"
              >
                <RedoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ py: 1 }}>
            {" "}
            {}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
            />{" "}
            {}
          </Box>

          {}
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Tooltip title="Export Configuration">
              <IconButton
                onClick={saveConfig}
                color="inherit"
                size="small"
                sx={{ mr: 1 }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Import Configuration">
              <IconButton
                color="inherit"
                onClick={() => document.getElementById("import-config").click()}
                size="small"
              >
                <CloudUploadIcon />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              accept=".json"
              onChange={loadConfig}
              style={{ display: "none" }}
              id="import-config"
            />
          </Box>

          <Box sx={{ py: 1 }}>
            {" "}
            {}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
            />{" "}
            {}
          </Box>

          {}
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <ToggleButtonGroup
              value={settings.viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="View Mode"
              size="small"
            >
              <ToggleButton value="2d" aria-label="2D View">
                2D
              </ToggleButton>
              <ToggleButton value="3d" aria-label="3D View">
                3D
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ py: 1 }}>
            {" "}
            {}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
            />{" "}
            {}
          </Box>

          {}
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Tooltip title="Settings">
              <IconButton
                color="inherit"
                onClick={handleSettingsClick}
                size="small"
                sx={{ mr: 1 }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Popover
              open={Boolean(settingsAnchorEl)}
              anchorEl={settingsAnchorEl}
              onClose={handleSettingsClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box sx={{ p: 2, minWidth: 250 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Resolution
                </Typography>
                <Slider
                  value={settings.resolution}
                  min={100}
                  max={800}
                  step={1}
                  onChange={handleResolutionChange}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Popover>
          </Box>

          {}
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Tooltip title="Color Palette">
              <IconButton
                color="inherit"
                onClick={handleColorPaletteClick}
                size="small"
                sx={{ mr: 1 }}
              >
                <PaletteIcon />
              </IconButton>
            </Tooltip>
            <Popover
              open={Boolean(colorPaletteAnchorEl)}
              anchorEl={colorPaletteAnchorEl}
              onClose={handleColorPaletteClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <ColorPaletteControls />
            </Popover>
          </Box>

          <Box sx={{ py: 1 }}>
            {" "}
            {}
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
            />{" "}
            {}
          </Box>

          {}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Help">
              <IconButton color="inherit" onClick={handleHelpOpen} size="small">
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <Dialog open={helpOpen} onClose={handleHelpClose}>
              <DialogTitle>Help</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Typography variant="h6" gutterBottom>
                    Keyboard Shortcuts:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Delete Layer"
                        secondary="Delete key"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Duplicate Layer"
                        secondary="Ctrl/Cmd + D"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Undo" secondary="Ctrl/Cmd + Z" />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Redo"
                        secondary="Ctrl/Cmd + Shift + Z"
                      />
                    </ListItem>
                  </List>
                  <Typography variant="h6" gutterBottom>
                    General usage:
                  </Typography>
                  <Typography>
                    Use the layer panel on the left to manage your noise layers.
                    You can add, delete, reorder, and adjust the parameters of
                    each layer. The "Save & Load" section allows you to export
                    and import your layer configurations.
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Click the icons on top bar to switch views, adjust settings
                    or change color palettes.
                  </Typography>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleHelpClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.default,
            boxShadow: theme.shadows[2],
            border: "none",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: "auto",
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ height: "40vh", overflowY: "auto", mb: 2 }}>
            <LayerList />
          </Box>
          <Divider sx={{ my: 2 }} />
          <SelectedLayerControls />
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          backgroundColor: theme.palette.background.default,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Container
          maxWidth="xl"
          sx={{ flexGrow: 1, py: 4, display: "flex", position: "relative" }}
        >
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              height: "100%",
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.shape.borderRadius * 1.5,
              backgroundColor: theme.palette.background.paper,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <NoiseVisualization layers={layers} settings={settings} />
          </Paper>
        </Container>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: theme.shape.borderRadius * 1.5,
            boxShadow: theme.shadows[6],
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppLayout;
