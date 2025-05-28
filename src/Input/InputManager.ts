/**
 * Represents any input event that can be handled by the input system.
 *
 * This includes mouse events, wheel scroll events, and keyboard events.
 * It is used in the dispatch mechanism to provide a generic event parameter
 * while preserving type safety.
 */
type InputEvent = MouseEvent | WheelEvent | KeyboardEvent;

/**
 * Represents the valid method names of an `InputHandler`.
 *
 * This is used to generically reference handler methods (e.g., `"onMouseDown"`)
 * when dispatching events dynamically.
 */
type HandlerMethod = keyof InputHandler;

/**
 * Interface for handling input events from an `InputManager`.
 *
 * Classes or objects implementing this interface can respond to various user input
 * events by optionally defining one or more of the following methods:
 *
 * - `onMouseDown`: Called when a mouse button is pressed down on the canvas.
 * - `onMouseUp`: Called when a mouse button is released on the canvas.
 * - `onMouseMove`: Called when the mouse moves over the canvas.
 * - `onMouseScroll`: Called when the mouse wheel is scrolled over the canvas.
 * - `onKeyDown`: Called when a key is pressed anywhere in the window.
 *
 * Implementers can choose to define only the events they care about. All methods are optional.
 */
export interface InputHandler {
    onMouseDown?(e: MouseEvent): void;
    onMouseUp?(e: MouseEvent): void;
    onMouseMove?(e: MouseEvent): void;
    onMouseScroll?(e: WheelEvent): void;
    onKeyDown?(e: KeyboardEvent): void;
}

/**
 * Manages user input events for a given HTML canvas element and delegates them
 * to registered input handlers.
 *
 * The `InputManager` listens for mouse and keyboard events on the canvas and
 * window, respectively. When an input event occurs, it dispatches the event to
 * all registered `InputHandler` instances that implement the corresponding
 * event handler method (e.g., `onMouseDown`, `onKeyDown`, etc.).
 *
 * This allows different parts of your application (tools, UI panels, etc.) to
 * respond to user input without tightly coupling them to the input system.
 */
export class InputManager {
    private canvas: HTMLCanvasElement;
    private handlers: InputHandler[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.canvas.addEventListener("mousedown", e => this.dispatch("onMouseDown", e));
        this.canvas.addEventListener("mouseup", e => this.dispatch("onMouseUp", e));
        this.canvas.addEventListener("mousemove", e => this.dispatch("onMouseMove", e));
        this.canvas.addEventListener("wheel", e => this.dispatch("onMouseScroll", e));
        window.addEventListener("keydown", e => this.dispatch("onKeyDown", e));
    }

    /**
    * Registers a new input handler to receive input events
    *
    * Input handlers are objects that optionally implement one or more of the methods
    * defined in the `InputHandler` interface, such as `onMouseDown`, `onMouseUp`, 
    * `onMouseMove`, `onMouseScroll`, and `onKeyDown`. These methods will be called 
    * whenever the corresponding input event is triggered on the canvas or window.
    *
    * Handlers are called in the order they are added. If a handler does not implement
    * a specific method, a warning will be logged to the console (unless the method
    * is called via optional chaining or checked manually).
    *
    * @param handler - An object that implements the `InputHandler` interface. This
    *                  object may implement any subset of the available event methods.
    *
    * @example
    * ```ts
    * class MyTool implements InputHandler {
    *   onMouseDown(e: MouseEvent) {
    *     console.log("Mouse down in MyTool", e);
    *   }
    * }
    *
    * const tool = new MyTool();
    * inputManager.addHandler(tool);
    * ```
    */
    public addHandler(handler: InputHandler) {
        this.handlers.push(handler);
    }

    /**
    * Dispatch will take in an InputHandler Method and call the appropriate function
    * @param {HandlerMethod} method - the method to call on child
    * @param {InputEvent} event - The matched event to the method
    */
    private dispatch<K extends HandlerMethod>(method: K, event: InputEvent) {
        for (const handler of this.handlers) {
            const fn = handler[method] as ((event: any) => void) | undefined;

            if (fn) {
                fn(event);
            } else {
                console.warn(`Please implement ${method} for: `, handler);
            }
        }
    }
}
