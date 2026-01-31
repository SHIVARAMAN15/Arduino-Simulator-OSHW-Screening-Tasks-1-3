# Arduino Simulator – OSHW Screening Tasks (1–3)

A minimal **web-based Arduino simulator** developed as part of the **FOSSEE Open Source Hardware (OSHW) screening tasks** at **IIT Bombay**.  
The simulator supports visual circuit creation, automatic pin wiring, Arduino code generation, and logic-level simulation using a push button and LED.

---

##  Project Overview

This project demonstrates a simple yet structured approach to simulating an Arduino-based experiment in the browser.  
Users can drag and drop components, configure digital pins, view auto-generated Arduino code, and run a logic-level simulation that mirrors the generated code behavior.

The implementation is intentionally minimal and focused on **engineering correctness**, **clarity**, and **extensibility**.

---

##  Supported Components

- Arduino Uno  
- LED  
- Push Button  

**Constraints:**
- Exactly **1 Arduino Uno**
- Exactly **1 LED**
- Exactly **1 Push Button**
- No additional components (breadboard, wires, resistors) are allowed

---

##  Features

### 🔹 Task 1 – Interface & Component Handling
- Drag-and-drop component palette
- Central canvas for circuit layout
- Single Arduino constraint
- Movable and removable components
- Read-only code view panel
- Start / Stop controls with visual feedback

### 🔹 Task 2 – Pin Management & Auto-Wiring
- Automatic default pin assignment:
  - LED → **D10**
  - Push Button → **D2**
- User-configurable digital pins (**D2–D13**)
- Pin conflict prevention (one pin per component)
- Automatic Arduino code generation using:
  - `pinMode`
  - `digitalRead`
  - `digitalWrite`

### 🔹 Task 3 – Logic-Level Simulation
- Logic-level simulation (HIGH / LOW only)
- Button uses `INPUT_PULLUP`
- Button pressed → LOW
- LED is **Active-High**
- Simulation behavior exactly mirrors generated Arduino code
- Dynamic pin reconfiguration during simulation

---


