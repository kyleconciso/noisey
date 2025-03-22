const p = new Uint8Array(512);

const grad3 = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
];

function dot(g, x, y, z) {
  return g[0] * x + g[1] * y + g[2] * z;
}

function initPermutationTable(seed = 0) {
  const rng = new Random(seed);

  const permutation = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    permutation[i] = i;
  }

  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }

  for (let i = 0; i < 256; i++) {
    p[i] = p[i + 256] = permutation[i];
  }
}

function perlin2D(x, y, seed = 0) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const A = p[X] + Y;
  const B = p[X + 1] + Y;
  const gradAA = grad(p[A], xf, yf);
  const gradBA = grad(p[B], xf - 1, yf);
  const gradAB = grad(p[A + 1], xf, yf - 1);
  const gradBB = grad(p[B + 1], xf - 1, yf - 1);
  const ix0 = lerp(gradAA, gradBA, u);
  const ix1 = lerp(gradAB, gradBB, u);
  return lerp(ix0, ix1, v);
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + t * (b - a);
}

function grad(hash, x, y) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

class Random {
  constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }
}

export const generatePerlinNoise = (
  width,
  height,
  scale,
  octaves,
  persistence,
  lacunarity,
  seed
) => {
  initPermutationTable(seed);
  const noise = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let nx = x / scale;
      let ny = y / scale;
      let value = 0;
      let frequency = 1;
      let amplitude = 1;
      let maxAmplitude = 0;

      for (let i = 0; i < octaves; i++) {
        value += perlin2D(nx * frequency, ny * frequency, seed) * amplitude;
        maxAmplitude += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
      }

      noise.push((value / maxAmplitude + 1) / 2);
    }
  }
  return noise;
};
