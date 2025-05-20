import { EventsFunctions } from "../Functions/events.functions";
import { Render2D } from "../Renders/Render2D";
import { EventsMap } from "../Types/Arguments";

class EventsController extends EventsFunctions {
    public static instance: EventsController;

    private listeners: { [K in keyof EventsMap]?: Array<(args: EventsMap[K]) => void> } = {};

    constructor(){
        super();
    }

    public static getInstance(): EventsController {
        if(!EventsController.instance){
            EventsController.instance = new EventsController();
        }

        return EventsController.instance;
    }

    public on<T extends keyof EventsMap>(eventName: T, listener: (args: EventsMap[T]) => void): void {
        if(!this.listeners[eventName]){
            this.listeners[eventName] = []
        }

        this.listeners[eventName].push(listener);
    }
    
    public off<T extends keyof EventsMap>(eventName: T, listener: (args: EventsMap[T]) => void): void {
        const handlers = this.listeners[eventName];
        if(!handlers) return;

        if(listener){
            this.listeners[eventName] = handlers.filter(fn => fn !== listener);
            return;
        }

        delete this.listeners[eventName];
    }

    public emit<T extends keyof EventsMap>(eventName: T, args: EventsMap[T]): void {
        const handlers = this.listeners[eventName];
        if(!handlers) return;

        handlers.forEach((fn) => fn(args))
    }
}

export { EventsController };