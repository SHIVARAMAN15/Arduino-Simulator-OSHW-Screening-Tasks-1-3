/**
 * Handles Drag and Drop functionality for the canvas and components.
 */
export class DragDropManager {
    constructor(canvasElement, uiManager) {
        this.canvas = canvasElement;
        this.uiManager = uiManager;
        this.components = []; // List of placed components: { id, type, element, x, y, pin }

        this.draggedItemType = null; // Type of item being dragged from palette
        this.activeComponent = null; // Component currently being moved on canvas
        this.offsetX = 0;
        this.offsetY = 0;

        this.initPaletteListeners();
        this.initCanvasListeners();
    }

    initPaletteListeners() {
        const items = document.querySelectorAll('.draggable-item');
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedItemType = item.dataset.type;
                e.dataTransfer.setData('text/plain', this.draggedItemType);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
    }

    initCanvasListeners() {
        // Drop from palette
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
            e.dataTransfer.dropEffect = 'copy';
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('text/plain');
            if (type) {
                this.addComponent(type, e.offsetX, e.offsetY);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.activeComponent) {
                e.preventDefault();
                const x = e.clientX - this.canvas.getBoundingClientRect().left - this.offsetX;
                const y = e.clientY - this.canvas.getBoundingClientRect().top - this.offsetY;

                this.moveComponent(this.activeComponent, x, y);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.activeComponent) {
                this.activeComponent.element.classList.remove('dragging');
                this.activeComponent = null;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            if (this.activeComponent) {
                this.activeComponent.element.classList.remove('dragging');
                this.activeComponent = null;
            }
        });
    }

    addComponent(type, x, y) {
        // --- Single Component Constraint Checks ---
        if (type === 'arduino-uno') {
            if (this.components.find(c => c.type === 'arduino-uno')) {
                alert('Only one Arduino Uno is allowed.');
                return;
            }
        }
        else if (type === 'led') {
            if (this.components.find(c => c.type === 'led')) {
                alert('Only one LED is allowed (Task 2 constraint).');
                return;
            }
        }
        else if (type === 'push-button') {
            if (this.components.find(c => c.type === 'push-button')) {
                alert('Only one Push Button is allowed (Task 2 constraint).');
                return;
            }
        }

        // --- Default Pin Checks (Strict) ---
        let assignedPin = null;
        if (type === 'led') {
            // LED MUST go to D10
            if (!this.uiManager.pinManager.isPinAvailable(10)) {
                alert('Cannot add LED: Default Pin D10 is occupied.');
                return;
            }
            assignedPin = 10;
        } else if (type === 'push-button') {
            // Button MUST go to D2
            if (!this.uiManager.pinManager.isPinAvailable(2)) {
                alert('Cannot add Push Button: Default Pin D2 is occupied.');
                return;
            }
            assignedPin = 2;
        }

        const id = 'comp-' + Date.now();

        // --- Commit Assignment ---
        if (assignedPin !== null) {
            this.uiManager.pinManager.assignPin(id, assignedPin);
        }

        const el = document.createElement('div');
        el.className = `placed-component comp-${type}`;
        el.id = id;
        el.dataset.id = id;

        // Use images for components
        const img = document.createElement('img');
        img.draggable = false; // Prevent default image drag

        if (type === 'arduino-uno') {
            img.src = 'assets/arduino_uno.png';
            img.style.width = '100%';
            img.style.height = '100%';
        } else if (type === 'led') {
            img.src = 'assets/led_red.png';
            img.style.width = '100%';
            img.style.height = '100%';
        } else if (type === 'push-button') {
            img.src = 'assets/push_button.png';
            img.style.width = '100%';
            img.style.height = '100%';
        }

        el.appendChild(img);

        // Set initial dimensions
        let width, height;
        if (type === 'arduino-uno') {
            width = 300;
            height = 220; // Aspect ratio approx
        } else if (type === 'led') {
            width = 30;
            height = 60; // Includes legs
        } else if (type === 'push-button') {
            width = 50;
            height = 50;
        }

        el.style.width = `${width}px`;
        el.style.height = `${height}px`;

        const finalX = Math.max(0, x - width / 2);
        const finalY = Math.max(0, y - height / 2);

        el.style.left = `${finalX}px`;
        el.style.top = `${finalY}px`;

        // Make draggable
        el.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Don't bubble to canvas drag
            this.activeComponent = this.components.find(c => c.id === id);
            this.activeComponent.element.classList.add('dragging');

            // Select component in UI
            this.uiManager.selectComponent(this.activeComponent);

            const rect = el.getBoundingClientRect();
            this.offsetX = e.clientX - rect.left;
            this.offsetY = e.clientY - rect.top;
        });

        // Add Delete option (right click)
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm('Remove this component?')) {
                this.removeComponent(id);
            }
        });

        this.canvas.appendChild(el);
        // Store pin in component data
        this.components.push({ id, type, element: el, x: finalX, y: finalY, pin: assignedPin });

        this.uiManager.updateCode(this.components);
    }

    moveComponent(component, x, y) {
        component.x = x;
        component.y = y;
        component.element.style.left = `${x}px`;
        component.element.style.top = `${y}px`;
    }

    removeComponent(id) {
        const index = this.components.findIndex(c => c.id === id);
        if (index !== -1) {
            const component = this.components[index];

            // Release Pin
            this.uiManager.pinManager.releaseComponentPins(id);

            component.element.remove();
            this.components.splice(index, 1);
            this.uiManager.updateCode(this.components);

            // Deselect if active
            this.uiManager.selectComponent(null);
        }
    }

    getComponents() {
        return this.components;
    }
}
