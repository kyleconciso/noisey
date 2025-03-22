# ⛰️ noisey

noisey is a web-based noise generation tool that allows you to create and visualize complex noise patterns using multiple layers. It's built with React, Redux, and Material UI, and uses Three.js for 3D rendering. You can interactively adjust parameters, blend layers, and export/import configurations.

## Features

- **Multi-Layer Noise Generation:** Create complex noise patterns by combining multiple layers of Perlin noise.
- **Interactive Controls:** Adjust parameters like scale, octaves, persistence, lacunarity, seed, weight, bias, and blend mode for each layer.
- **2D and 3D Visualization:** Switch between 2D and 3D representations of the generated noise.
- **Hypsometric Tinting:** Apply color gradients based on height values in the noise. Customize the color ranges.
- **Layer Management:** Add, delete, duplicate, reorder, and toggle the visibility of layers.
- **Import/Export:** Save and load your layer configurations as JSON files.
- **Undo/Redo:** Undo and redo changes to the layer configuration.
- **Keyboard Shortcuts:**
  - Delete: Delete selected layer
  - Ctrl/Cmd + D: Duplicate selected layer
  - Ctrl/Cmd + Z: Undo
  - Ctrl/Cmd + Shift + Z: Redo

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/kyleconciso/noisey
    cd .\noisey\noisey\
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm start
    ```

    This will open the application in your default browser (usually at `http://localhost:3000`).

## Usage

- **Layers Panel (Left):** Manage your noise layers. Add new layers, select a layer to edit its properties, reorder layers using drag-and-drop, and delete or duplicate layers.
- **Selected Layer Controls (Left, Bottom):** Adjust the parameters (seed, scale, octaves, etc.) of the currently selected layer.
- **Top Bar:**
  - **Undo/Redo:** Undo and redo changes.
  - **Save/Load:** Export and import layer configurations.
  - **View Mode:** Toggle between 2D and 3D visualization.
  - **Settings:** Adjust the resolution of the noise.
  - **Color Palette:** Customize the color ranges used for hypsometric tinting.
  - **Help** Open keyboard shortcut and usage information.
- **Visualization:** Displays the generated noise in either 2D or 3D. In 3D mode, you can rotate and zoom the view using your mouse.

## Dependencies

- **React:** JavaScript library for building user interfaces.
- **Redux:** State management library.
- **Material UI:** React component library for UI elements.
- **Three.js:** JavaScript 3D library.
- **three-stdlib:** Collection of add-ons and helpers for three.js
- **@dnd-kit:** Drag and drop library

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

This project is open-source and available for use.
