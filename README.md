# 🎮 Breaks Breakout — Modern OpenGL Game

A modern C++/OpenGL implementation of the classic Atari Breakout, built using advanced graphics techniques like particle systems, post-processing, and real-time rendering.

---

## 🚀 Features

- 🧱 AABB Collision Detection\
  Accurate collision handling between ball, paddle, and bricks.

- ✨ Particle System\
  Dynamic visual effects for enhanced gameplay experience.

- 🎨 Post-Processing Effects\
  Includes screen effects like chaos, confuse, and visual filters.

- 🗺️ Level Maps\
  Multiple levels loaded from external files.

- 🖼️ Sprite Rendering\
  Efficient rendering using textures and shaders.

- 🔤 Text Rendering\
  Display UI elements like score, lives, and menus.

- 🔊 Dynamic Audio\
  Real-time sound effects for collisions and gameplay events.

---

## 🛠️ Tech Stack

- Language: C++
- Graphics API: OpenGL
- Math Library: GLM
- Windowing/Input: GLFW
- OpenGL Loader: GLAD
- Audio: irrKlang (or similar)
- Build Tool: Visual Studio

---

## 📦 Dependencies

Make sure the following are installed:

- Windows 10 or higher
- Visual Studio
- Git Version Control

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```
git clone https://github.com/apurva333pm-beep/Bricks-Breakout-1-.git
cd your-repo-name
```

### 2. Open in Visual Studio

- Open the `.sln` file
- Set configuration to Debug or Release (x64)

### 3. Configure Dependencies

Ensure all libraries are linked properly:

- GLAD
- GLFW
- GLM
- irrKlang (if used)

### 4. Build and Run

- Press Ctrl + F5 or click Run
- Game window will launch

---

## 🎮 Controls

| Key             | Action            |
| --------------- | ----------------- |
| A / Left Arrow  | Move Paddle Left  |
| D / Right Arrow | Move Paddle Right |
| Space           | Launch Ball       |
| H               | Help Menu         |
| ESC             | Exit              |

---

## 📂 Project Structure

```
├── src/
│   ├── Game.cpp / Game.h
│   ├── GameLevel.cpp / GameLevel.h
│   ├── GameObject.cpp / GameObject.h
│   ├── BallObject.cpp / BallObject.h
│
├── resources/
│   ├── textures/
│   ├── shaders/
│   ├── levels/
│   ├── audio/
│
├── main.cpp
└── README.md
```

---

## 🧠 Concepts Implemented

- Game Loop Architecture
- Collision Detection (AABB and Circle vs AABB)
- Physics-based Ball Reflection
- Resource Management System
- Power-Up System
- Shader-based Rendering

---

---

## 🙌 Credits

- OpenGL tutorials and reference materials

---

## 📌 Note

This project is built for educational purposes in Computer Graphics and Game Development.
