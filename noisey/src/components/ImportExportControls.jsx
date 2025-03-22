import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLayers } from "../store/layersSlice";
import {
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Grid,
  Paper,
  Divider,
  useTheme,
  alpha,
  Fade,
  Stack,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BackupIcon from "@mui/icons-material/Backup";

const ImportExportControls = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const layers = useSelector((state) => state.layers.layers);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [fileHover, setFileHover] = React.useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

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
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: theme.shape.borderRadius * 1.5,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 2px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        overflow: "hidden",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        p={2}
        pb={1}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <SaveIcon
          sx={{
            mr: 1,
            color: theme.palette.primary.main,
            fontSize: 20,
          }}
        />
        <Typography variant="h6" fontWeight="500" sx={{ fontSize: "1rem" }}>
          Save & Load
        </Typography>
      </Box>

      <Box p={2}>
        {" "}
        {}
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            borderLeft: `3px solid ${alpha(theme.palette.info.main, 0.7)}`,
            pl: 1,
            py: 0.5,
            backgroundColor: alpha(theme.palette.info.main, 0.05),
            borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
            fontSize: "0.75rem",
          }}
        >
          Save your current configuration or load a previously saved setup.
        </Typography>
        <Stack spacing={2}>
          {" "}
          {}
          <Tooltip title="Save current configuration to a JSON file">
            <Button
              variant="contained"
              fullWidth
              startIcon={<DownloadIcon />}
              onClick={saveConfig}
              sx={{
                py: 1,
                borderRadius: theme.shape.borderRadius * 1.5,
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
                textTransform: "none",
                fontWeight: 500,
                boxShadow: theme.shadows[2],
                fontSize: "0.8rem",
              }}
            >
              Export
            </Button>
          </Tooltip>
          <Paper
            component="label"
            elevation={0}
            onMouseEnter={() => setFileHover(true)}
            onMouseLeave={() => setFileHover(false)}
            sx={{
              p: 1,
              border: `2px dashed ${
                fileHover
                  ? theme.palette.primary.main
                  : alpha(theme.palette.divider, 0.3)
              }`,
              borderRadius: theme.shape.borderRadius * 1.5,
              transition: theme.transitions.create(
                ["border-color", "box-shadow"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: fileHover
                ? alpha(theme.palette.primary.main, 0.05)
                : "transparent",
              boxShadow: fileHover
                ? `0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`
                : "none",
            }}
          >
            <input
              type="file"
              accept=".json"
              onChange={loadConfig}
              style={{ display: "none" }}
            />

            <CloudUploadIcon
              color="primary"
              sx={{
                fontSize: 32,
                mb: 0.5,
                transition: theme.transitions.create(["transform"], {
                  duration: theme.transitions.duration.short,
                }),
                transform: fileHover ? "scale(1.1)" : "scale(1)",
              }}
            />

            <Typography
              variant="body1"
              fontWeight="500"
              align="center"
              gutterBottom
              sx={{ fontSize: "0.8rem" }}
            >
              Drag & drop or click to import
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ fontSize: "0.7rem" }}
            >
              Upload a saved configuration
            </Typography>
          </Paper>
        </Stack>
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
    </Paper>
  );
};

export default ImportExportControls;
