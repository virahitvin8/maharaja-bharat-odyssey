<div align="center">

![Header](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=FF9933,FFFFFF,138808&height=250&section=header&text=Maharaja's%20Bharat%20Odyssey&fontSize=50&fontAlignY=35&fontColor=ffffff&desc=The%20First%20Open-Source%20Dynamic%20OSM%20Indian%203D%20Platformer&descAlignY=55)

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
  <a href="https://docs.pmnd.rs/react-three-fiber/"><img src="https://img.shields.io/badge/R3F-000000?style=for-the-badge&logo=react&logoColor=white" alt="React Three Fiber" /></a>
  <a href="https://rapier.rs/"><img src="https://img.shields.io/badge/Rapier_Physics-FF5A00?style=for-the-badge&logo=rust&logoColor=white" alt="Rapier Physics" /></a>
  <a href="https://capacitorjs.com/"><img src="https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" /></a>
  <a href="https://www.openstreetmap.org/"><img src="https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white" alt="OSM" /></a>
</p>

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

<br/>

**Experience India like never before.** A massive 3D open-world platformer dynamically generated in real-time from OpenStreetMap (OSM) public data. Run the streets of Varanasi, jump over actual buildings, and explore the Ganges — all rendered in your browser or on Android.

</div>

---

## 🚀 The Vision: Google Maps Meets Super Mario 64

We are building a highly aesthetic, premium 3D open-world game using **100% Free and Public APIs**.

*   **Dynamic Streaming World**: We fetch live real-world geospatial data from the Overpass API (OpenStreetMap).
*   **Procedural Extrusion**: Real building footprints are converted into 3D geometry on the fly.
*   **Real-World Collision**: Navigate physical streets, jump on actual roofs, and interact with the physical geography of India using Rapier physics.
*   **Zero Asset Dependencies**: All environments (trees, temples, rivers) are procedurally generated using WebGL and Three.js primitives based on OSM tags (`natural=tree`, `waterway=river`, `amenity=place_of_worship`).

---

## 🎮 Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **🌐 Dynamic World Streaming** | Fetches live OSM chunks using Overpass API based on GPS coordinates. | ✅ |
| **🏙️ 3D Building Extrusion** | Parses GeoJSON into `THREE.ExtrudeGeometry` with accurate heights. | ✅ |
| **🏃 Fluid Mario Physics** | Triple jumps, ground pounds, and sword attacks using Rapier rigidbodies. | ✅ |
| **📱 Mobile First Design** | Built-in virtual joystick and touch controls, deployed via Capacitor. | ✅ |
| **☀️ Dynamic Atmosphere** | Real-time day/night cycles, dynamic weather, and gorgeous lighting. | ✅ |
| **🎶 Procedural Audio** | Custom Web Audio API implementation — no external MP3s needed! | ✅ |

---

## 🛠️ Technology Architecture

### Free APIs & Integrations
*   **[Overpass API](https://overpass-api.de/)**: Public API used to query map features by bounding box.
*   **[OpenStreetMap](https://www.openstreetmap.org/)**: The core dataset providing building shapes, highway nodes, and landuse polygons.

### Game Engine Stack
<div align="center">
  <img src="https://github-readme-stats.vercel.app/api/pin/?username=akshit&repo=maharaja-bharat-odyssey&theme=dark&bg_color=050510&title_color=FF9933" alt="GitHub Repo Stats" />
</div>

---

## 💻 Running Locally

You can run this entire world on your local machine using Vite.

```bash
# Clone the repository
git clone https://github.com/akshit/maharaja-bharat-odyssey.git

# Navigate to the project directory
cd maharaja-bharat-odyssey

# Install dependencies (Legacy peer deps required for R3F 8)
npm install --legacy-peer-deps

# Start the high-performance dev server
npm run dev
```
Navigate to `http://localhost:5173` to start playing instantly.

---

## 📱 Android Build (Google Play Store)

This game is fully configured to compile natively to Android using **Capacitor**.

1.  Build the WebGL frontend:
    ```bash
    npm run build
    ```
2.  Sync the native code:
    ```bash
    npx cap sync android
    ```
3.  Open Android Studio to generate the Signed `.aab` for the Play Store:
    ```bash
    npx cap open android
    ```

---

## 🗺️ How the Map Generation Works

We fetch chunk data utilizing the public Overpass QL, parsing `nodes` and `ways` into a local coordinate space:

1.  **Coordinate Projection**: Converts WGS84 (Lat/Lon) to a local Cartesian grid using Web Mercator (`proj4`).
2.  **Meshing**:
    *   `building` tags ➡️ `THREE.Shape` ➡️ `THREE.ExtrudeGeometry`.
    *   `highway` tags ➡️ Spline interpolation ➡️ `THREE.BufferGeometry` (roads).
    *   `natural=water` tags ➡️ Animated glassmorphism planes.
3.  **Physics Generation**: A `trimesh` collider is wrapped around every extruded mesh on the fly.

---

<div align="center">
  <h3>Built with ❤️ in India by Akshit</h3>
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=akshit&theme=gruvbox" alt="Developer Stats" />
</div>
