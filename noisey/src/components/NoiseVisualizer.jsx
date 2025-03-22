import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
import { generatePerlinNoise } from "../utils";
import { Box } from "@mui/material";

const NoiseVisualizer = ({ layers, settings }) => {
  const canvasRef = useRef(null);
  const threeContainerRef = useRef(null);
  const [rendererInstance, setRendererInstance] = useState(null);
  const [controls, setControls] = useState(null);

  const { viewMode, resolution, hypsometricTinting, hypsometricRanges } =
    settings;

  useEffect(() => {
    if (rendererInstance) {
      rendererInstance.dispose();
      rendererInstance.forceContextLoss();
      if (rendererInstance.domElement) {
        rendererInstance.domElement.parentNode?.removeChild(
          rendererInstance.domElement
        );
      }
      setRendererInstance(null);
    }

    if (controls) {
      controls.dispose();
      setControls(null);
    }

    if (viewMode === "2d") {
      render2D();
    } else {
      render3D();
    }
  }, [layers, viewMode, resolution, hypsometricTinting, hypsometricRanges]);

  const render2D = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, resolution, resolution);

    const imageData = ctx.createImageData(resolution, resolution);
    const data = imageData.data;

    const visibleLayers = layers.filter((layer) => layer.visible);

    if (visibleLayers.length === 0) {
      ctx.fillStyle = "#ddd";
      ctx.fillRect(0, 0, resolution, resolution);
      ctx.fillStyle = "#999";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No visible layers", resolution / 2, resolution / 2);
      return;
    }

    const noiseLayers = visibleLayers.map((layer) => ({
      noise: generatePerlinNoise(
        resolution,
        resolution,
        layer.scale,
        layer.octaves,
        layer.persistence,
        layer.lacunarity,
        layer.seed
      ),
      blendMode: layer.blendMode,
      weight: layer.weight,
      bias: layer.bias,
    }));

    for (let i = 0; i < resolution * resolution; i++) {
      let r = 0,
        g = 0,
        b = 0;

      for (let j = 0; j < noiseLayers.length; j++) {
        let { noise, blendMode, weight, bias } = noiseLayers[j];
        let value = noise[i];
        value = Math.max(0, Math.min(1, value + bias));
        let pixelValue = Math.floor(value * 255);

        let layerR, layerG, layerB;

        if (hypsometricTinting) {
          let foundRange = false;
          for (let k = 0; k < hypsometricRanges.length; k++) {
            const range = hypsometricRanges[k];
            if (pixelValue >= range.start && pixelValue <= range.end) {
              const color = parseInt(range.color.substring(1), 16);
              layerR = (color >> 16) & 255;
              layerG = (color >> 8) & 255;
              layerB = color & 255;
              foundRange = true;
              break;
            }
          }
          if (!foundRange) {
            layerR = pixelValue;
            layerG = pixelValue;
            layerB = pixelValue;
          }
        } else {
          layerR = pixelValue;
          layerG = pixelValue;
          layerB = pixelValue;
        }

        switch (blendMode) {
          case "add":
            r += layerR * weight;
            g += layerG * weight;
            b += layerB * weight;
            break;
          case "subtract":
            r -= layerR * weight;
            g -= layerG * weight;
            b -= layerB * weight;
            break;
          case "multiply":
            r = (r * layerR * weight) / 255;
            g = (g * layerG * weight) / 255;
            b = (b * layerB * weight) / 255;
            break;
          case "screen":
            r = 255 - ((255 - r) * (255 - layerR * weight)) / 255;
            g = 255 - ((255 - g) * (255 - layerG * weight)) / 255;
            b = 255 - ((255 - b) * (255 - layerB * weight)) / 255;
            break;
          default:
            r += layerR * weight;
            g += layerG * weight;
            b += layerB * weight;
        }
      }

      let totalWeight = visibleLayers.reduce(
        (acc, layer) => acc + layer.weight,
        0
      );
      r = Math.min(255, Math.max(0, r / totalWeight));
      g = Math.min(255, Math.max(0, g / totalWeight));
      b = Math.min(255, Math.max(0, b / totalWeight));
      const index = i * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const render3D = () => {
    const container = threeContainerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(resolution, resolution);
    container.appendChild(renderer.domElement);
    setRendererInstance(renderer);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    const visibleLayers = layers.filter((layer) => layer.visible);
    if (visibleLayers.length === 0) {
      const geometry = new THREE.PlaneGeometry(10, 10);
      const material = new THREE.MeshBasicMaterial({ color: 0xdddddd });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);
    } else {
      const gridSize = 50;
      const terrainSize = 10;
      const geometry = new THREE.PlaneGeometry(
        terrainSize,
        terrainSize,
        gridSize - 1,
        gridSize - 1
      );
      const combinedNoise = new Array(gridSize * gridSize).fill(0);
      let totalWeight = 0;
      visibleLayers.forEach((layer) => {
        const noise = generatePerlinNoise(
          gridSize,
          gridSize,
          layer.scale / 10,
          layer.octaves,
          layer.persistence,
          layer.lacunarity,
          layer.seed
        );
        for (let i = 0; i < noise.length; i++) {
          const biasedNoise = Math.max(0, Math.min(1, noise[i] + layer.bias));
          combinedNoise[i] += biasedNoise * layer.weight;
        }
        totalWeight += layer.weight;
      });
      if (totalWeight > 0) {
        for (let i = 0; i < combinedNoise.length; i++) {
          combinedNoise[i] /= totalWeight;
        }
      }
      const vertices = geometry.attributes.position.array;
      for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
        const height = combinedNoise[j];
        vertices[i + 2] = height * 2;
      }
      geometry.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({
        color: 0x808080,
        wireframe: false,
        flatShading: true,
      });
      const terrain = new THREE.Mesh(geometry, material);
      terrain.rotation.x = -Math.PI / 2;
      scene.add(terrain);
    }
    const newControls = new OrbitControls(camera, renderer.domElement);
    setControls(newControls);
    const animate = () => {
      if (!rendererInstance) return;
      requestAnimationFrame(animate);
      newControls.update();
      renderer.render(scene, camera);
    };
    animate();
  };

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      {" "}
      {}
      {viewMode === "2d" ? (
        <canvas
          ref={canvasRef}
          width={resolution}
          height={resolution}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.5)",
          }}
        />
      ) : (
        <Box
          ref={threeContainerRef}
          sx={{
            width: "100%",
            height: "100%",
            boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
    </Box>
  );
};

export default NoiseVisualizer;
