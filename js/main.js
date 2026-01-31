import { UIManager } from './ui-manager.js';
import { DragDropManager } from './drag-drop.js';
import { Simulator } from './simulator.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Managers
    const uiManager = new UIManager();
    const canvas = document.getElementById('simulation-canvas');
    const dragDropManager = new DragDropManager(canvas, uiManager);

    // Initialize Simulator
    const simulator = new Simulator(dragDropManager);

    // Make available globally for debugging if needed
    window.dragDropManager = dragDropManager;
    window.simulator = simulator;

    // Hook up Simulator to UI Controls
    // UIManager handles the visual toggling of Start/Stop buttons.
    // We attach additional listeners to trigger the engine.

    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');

    btnStart.addEventListener('click', () => {
        simulator.start();
    });

    btnStop.addEventListener('click', () => {
        simulator.stop();
    });
});
