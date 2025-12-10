# LRU Visual Learning Hub  
### Interactive LRU Page Replacement Simulator (For VS Code Users)

This project is a fully animated visualization of the **Least Recently Used (LRU)** Page Replacement Algorithm used in Operating Systems.  
It is designed for learning, teaching, OS lab experiments, and interactive demonstrations.

The simulator features:
- Canvas animations  
- Page Hit & Page Fault effects  
- Step controls (Play, Pause, Step Forward, Step Back)  
- Speed control  
- Detailed statistics table  
- Export Screenshot (PNG)  
- Export Execution Trace (JSON)  
- Clean pastel UI theme  

This README is tailored for **running the project inside Visual Studio Code**.

---

# 🖥️ How to Run This Project in VS Code

##  1. Install Visual Studio Code
Download from:  
https://code.visualstudio.com/

##  2. Install the “Live Server” Extension
1. Open VS Code  
2. Go to the **Extensions** panel  
3. Search for **Live Server**  
4. Click **Install**

##  3. Open the Project Folder
1. Go to **File → Open Folder**  
2. Select the folder containing:

##  4. Run the Project
1. Right-click **index.html**
2. Click **Open with Live Server**

Your browser will automatically open the LRU Simulator.

---

#  Project Structure

lru-visual-learning-hub/
│
├── index.html → Main UI layout
├── style.css → Styles & gradient theme
├── script.js → Simulation logic & animations
└── README.md → Project documentation

---

#  Features Overview

##  Animated Canvas Simulation
- Visual animation for page replacement  
- LRU eviction rotates + slides out  
- Incoming page slides in  
- Page Hit shows glowing green highlight  
- Page Fault shows red animation and popup  

## 🎛 Playback Controls
-  **Play Simulation**  
- **Pause**  
-  **Step Forward**  
-  **Step Backward**  
- ⏱ **Adjust Speed** slider  

##  Automatic Statistics Table
Displays:
- Total page references  
- Number of frames  
- Total page faults  
- Total page hits  
- Fault ratio  
- Hit ratio  
- Efficiency %  
- Full step-by-step execution trace  

##  Export Options
- **Export Screenshot (PNG)**  
- **Export Execution Trace (JSON)**  

Useful for lab records, reports, or debugging.

---

#  How to Use the Simulator

##  1. Enter Page Reference String  
Example:7,0,1,2,0,3,0,4

##  2. Enter Number of Frames  
Example:3

##  3. Click **Start Simulation**
This initializes memory, logs, animation paths, and statistics.

##  4. Animate or Step Through
Use Play/Pause or Step buttons to move through the simulation.

##  5. Export Results
- Screenshot → saves PNG of the animation  
- Trace → saves JSON file of all steps  

---

#  What You Will Learn from This Tool

- How LRU selects the least recently used page  
- How page faults occur  
- How memory frames change over time  
- Difference between page hit & page fault  
- Understanding of page replacement algorithms  
- How animation helps visualize OS concepts  

---

# 🛠 Technologies Used

- **HTML5 Canvas**
- **CSS3 + Gradient Background**
- **JavaScript (ES6)**
- **Bootstrap 5**
- **VS Code + Live Server**

---


<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/93923158-e25b-4f48-a305-7c107015e365" />



#  Credits
Created for Operating Systems Lab learning and visual demonstration.




