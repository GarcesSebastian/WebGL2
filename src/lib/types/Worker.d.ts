export type WorkerType = "init" | "gravity" |"physics" | "create" | "click" | "dragstart";

export type WorkerMessage = {
    type: WorkerType;
    data: any;
}