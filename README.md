# Lightning Racing Game

A thrilling 3D racing game inspired by Lightning McQueen, built with Three.js. Race against AI opponents, manage your fuel, and complete three laps to victory!

## 🎮 Game Features

Experience an immersive 3D racing environment complete with a stadium, cheering audience, and a challenging race track filled with twists and turns. The game features a dual-view system, giving you both a main racing perspective and a helpful minimap for strategic navigation.

The racing mechanics are designed to be engaging and realistic, featuring smooth car controls with drifting capabilities. You'll need to manage your fuel and health while competing against AI-controlled opponents. The game tracks your progress with a real-time dashboard showing your score, lap times, and vital statistics.

![Gameplay](./assets/screenshot.jpeg)

Strategic gameplay elements include randomly spawning fuel cans that you'll need to collect to stay in the race. Keep an eye on your health and avoid collisions with other racers as you aim to complete three exciting laps!

## 🛠️ Prerequisites

Before you begin, ensure you have Node.js installed on your system.

## 📥 Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install the required dependencies:
```bash
npm install three
npm install webpack
npm install -g servez
```

## 🚀 Running the Game

1. Build the project (required after any code changes):
```bash
npx webpack --config webpack.config.js
```

2. Start the server:
```bash
servez .
```

3. Navigate to `/dist` in your browser to play the game

## 🎮 Controls

- **W**: Accelerate
- **S**: Brake/Reverse
- **A**: Turn Left
- **D**: Turn Right
- **Drifting**: 
  - Press S + A for left drift
  - Press S + D for right drift
  - Note: Don't accelerate while drifting!

## 🏁 Game Objectives

1. Complete 3 laps before running out of fuel
2. Collect fuel cans to maintain your fuel level
3. Avoid collisions with other cars to preserve health
4. Use drifting strategically to maintain speed in turns

## 🎯 Gameplay Tips

- Monitor your fuel gauge constantly
- Plan your route to collect fuel cans efficiently
- Use drifting for tight corners, but time it carefully
- Watch out for aggressive AI opponents
- Keep an eye on the minimap for strategic positioning

## ⚠️ Troubleshooting

If you encounter any issues:
1. Ensure all assets are properly downloaded and placed in the correct directory
2. Check if all dependencies are properly installed
3. Clear your browser cache if you experience display issues
4. Make sure you're using a modern browser with WebGL support

## 🔧 Development

The game is built using:
- Three.js for 3D rendering
- Webpack for bundling
- Custom physics engine for car mechanics
- Advanced AI system for opponent cars

## 🎨 Credits

- 3D models and textures sourced from [Sketchfab](https://sketchfab.com)
# 3D-Car-Racing-Game
