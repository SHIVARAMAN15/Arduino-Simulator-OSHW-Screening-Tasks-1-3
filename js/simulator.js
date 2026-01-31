/**
 * Logic-Level Simulator Engine.
 * Simulates Arduino Uno Pin States (0-13) and runs a specific logic loop.
 */
export class Simulator {
    constructor(dragDropManager) {
        this.dragDropManager = dragDropManager;
        this.pins = new Array(14).fill(1); // Default to HIGH (INPUT_PULLUP behavior)
        this.intervalId = null;
        this.frameRate = 20; // 50Hz simulation
    }

    start() {
        if (this.intervalId) return;
        this.intervalId = setInterval(() => this.step(), 1000 / this.frameRate);
        console.log('Simulator: Started');
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.reset();
            console.log('Simulator: Stopped');
        }
    }

    reset() {
        // Turn off all visual components
        const components = this.dragDropManager.getComponents();
        components.forEach(comp => {
            if (comp.type === 'led') {
                const img = comp.element.querySelector('img');
                if (img) img.style.filter = 'none';
            }
        });
        // Reset pins
        this.pins.fill(1);
    }

    step() {
        const components = this.dragDropManager.getComponents();
        const button = components.find(c => c.type === 'push-button');
        const led = components.find(c => c.type === 'led');

        // --- 1. Physics Input (Update Pins from Environment) ---
        if (button && button.pin !== null) {
            // Check if user is pressing the button (CSS :active state hack or tracking)
            const isPressed = button.element.matches(':active');

            // Logic: Button is connected to GND. Pressed = LOW. Released = HIGH (Pullup).
            this.pins[button.pin] = isPressed ? 0 : 1;
        }

        // --- 2. MCU Logic (The "Sketch") ---
        // Emulating: digitalWrite(ledPin, buttonState == LOW ? HIGH : LOW);

        let ledPinValue = 0; // Default off

        if (button && led && button.pin !== null && led.pin !== null) {
            const buttonState = this.pins[button.pin]; // digitalRead
            const outputVal = (buttonState === 0) ? 1 : 0; // Logic

            this.pins[led.pin] = outputVal; // digitalWrite
            ledPinValue = outputVal;
        }

        // --- 3. Physics Output (Update Visuals from Pins) ---
        if (led && led.pin !== null) {
            const pinState = this.pins[led.pin];
            const img = led.element.querySelector('img');

            // Logic Constraint: LED Active High. High (1) = ON.
            if (pinState === 1) {
                if (img) img.style.filter = 'drop-shadow(0 0 10px red) brightness(1.5)';
            } else {
                if (img) img.style.filter = 'none';
            }
        }
    }
}
