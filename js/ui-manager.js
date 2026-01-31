/**
 * Manages the User Interface interactions, including the toolbar, code view, and properties panel.
 */
import { PinManager } from './pin-manager.js';

export class UIManager {
    constructor() {
        this.pinManager = new PinManager();
        this.btnStart = document.getElementById('btn-start');
        this.btnStop = document.getElementById('btn-stop');
        this.btnToggleCode = document.getElementById('btn-toggle-code');
        this.btnCloseCode = document.getElementById('btn-close-code');
        this.codePanel = document.getElementById('code-panel');
        this.codeEditor = document.getElementById('code-editor');

        this.propertiesPanel = document.getElementById('properties-panel');
        this.propCompType = document.getElementById('prop-comp-type');
        this.propPinSelect = document.getElementById('prop-pin-select');
        this.propPinGroup = document.getElementById('prop-pin-group');

        this.isRunning = false;
        this.selectedComponent = null;

        this.initListeners();
    }

    initListeners() {
        this.btnStart.addEventListener('click', () => this.toggleSimulation(true));
        this.btnStop.addEventListener('click', () => this.toggleSimulation(false));

        this.btnToggleCode.addEventListener('click', () => {
            this.codePanel.classList.toggle('hidden');
        });

        this.btnCloseCode.addEventListener('click', () => {
            this.codePanel.classList.add('hidden');
        });

        this.propPinSelect.addEventListener('change', (e) => {
            if (this.selectedComponent) {
                const newPin = parseInt(e.target.value);
                const oldPin = this.selectedComponent.pin;

                if (newPin !== oldPin) {
                    if (this.pinManager.assignPin(this.selectedComponent.id, newPin)) {
                        this.pinManager.releasePin(oldPin);
                        this.selectedComponent.pin = newPin;
                        this.updateCode(window.dragDropManager.getComponents()); // Access via global or pass ref
                        // Note: ideally dragDropManager instance is passed to UIManager or vice versa cleanly
                    } else {
                        alert('Pin assignment failed. It might be occupied.');
                        this.populatePinSelect(this.selectedComponent); // Reset
                    }
                }
            }
        });
    }

    toggleSimulation(start) {
        this.isRunning = start;
        if (start) {
            this.btnStart.classList.add('hidden');
            this.btnStop.classList.remove('hidden');
            console.log('Simulation Started');
        } else {
            this.btnStart.classList.remove('hidden');
            this.btnStop.classList.add('hidden');
            console.log('Simulation Stopped');
            // Reset visuals
            this.resetSimulationVisuals();
        }
    }

    resetSimulationVisuals() {
        // Reset LED styles
        const leds = document.querySelectorAll('.comp-led img');
        leds.forEach(img => img.style.filter = 'none');
    }

    updateCode(components) {
        const arduino = components.find(c => c.type === 'arduino-uno');
        const led = components.find(c => c.type === 'led');
        const button = components.find(c => c.type === 'push-button');

        let code = `// Arduino Simulator – Task 2 Strict\n`;
        code += `// ----------------------------------------\n\n`;

        if (!arduino) {
            code += `// No Arduino Uno detected.\n`;
        } else {
            // Task 2: Strict One-to-One Logic
            if (led) {
                code += `const int ledPin = ${led.pin};\n`;
            }
            if (button) {
                code += `const int buttonPin = ${button.pin};\n`;
            }

            code += `\nvoid setup() {\n`;
            if (led) {
                code += `  pinMode(ledPin, OUTPUT);\n`;
            }
            if (button) {
                code += `  pinMode(buttonPin, INPUT_PULLUP);\n`;
            }
            code += `}\n\n`;

            code += `void loop() {\n`;
            if (led && button) {
                code += `  int buttonState = digitalRead(buttonPin);\n`;
                code += `  digitalWrite(ledPin, buttonState == LOW ? HIGH : LOW);\n`;
            } else {
                code += `  // Add both LED and Button to see logic.\n`;
            }
            code += `}\n`;
        }

        this.codeEditor.textContent = code;
    }

    selectComponent(component) {
        this.selectedComponent = component;
        if (component && component.type !== 'arduino-uno') {
            this.propertiesPanel.classList.remove('hidden');
            this.propCompType.textContent = component.type;

            if (component.type === 'led' || component.type === 'push-button') {
                this.propPinGroup.classList.remove('hidden');
                this.populatePinSelect(component);
            } else {
                this.propPinGroup.classList.add('hidden');
            }
        } else {
            this.propertiesPanel.classList.add('hidden');
        }
    }

    populatePinSelect(component) {
        this.propPinSelect.innerHTML = '';

        // Pins 2-13
        for (let i = 2; i <= 13; i++) {
            // Pin is valid if it's free OR if it's the current pin of this component
            if (this.pinManager.isPinAvailable(i) || i === component.pin) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `D${i}`;
                if (i === component.pin) {
                    option.selected = true;
                }
                this.propPinSelect.appendChild(option);
            }
        }
    }
}
