/**
 * Manages the state of Arduino pins (D2-D13) and enforces validation constraints.
 * Purely strict state tracking, no auto-resolution.
 */
export class PinManager {
    constructor() {
        // Pins D2 to D13 available on Arduino Uno
        this.pins = {};
        for (let i = 2; i <= 13; i++) {
            this.pins[i] = null; // null = free, componentId = occupied
        }
    }

    /**
     * Checks if a specific pin is available.
     * @param {number} pin 
     * @returns {boolean}
     */
    isPinAvailable(pin) {
        return this.pins[pin] === null;
    }

    /**
     * Assigns a pin to a component. Returns true if successful.
     * @param {string} componentId 
     * @param {number} pin 
     * @returns {boolean}
     */
    assignPin(componentId, pin) {
        if (!this.isValidPin(pin)) return false;
        if (!this.isPinAvailable(pin)) return false;

        this.pins[pin] = componentId;
        return true;
    }

    /**
     * Releases a pin (makes it available again).
     * @param {number} pin 
     */
    releasePin(pin) {
        if (this.isValidPin(pin)) {
            this.pins[pin] = null;
        }
    }

    /**
     * Releases all pins assigned to a specific component.
     * @param {string} componentId 
     */
    releaseComponentPins(componentId) {
        for (const pin in this.pins) {
            if (this.pins[pin] === componentId) {
                this.pins[pin] = null;
            }
        }
    }

    /**
     * Returns a list of all currently used pins.
     * @returns {number[]}
     */
    getUsedPins() {
        return Object.keys(this.pins)
            .map(p => parseInt(p))
            .filter(p => this.pins[p] !== null);
    }

    /**
     * Checks if pin number is within valid range (2-13).
     */
    isValidPin(pin) {
        return pin >= 2 && pin <= 13;
    }
}
