import Sensor from "./Sensors/Sensor";

export default interface Work {
    id: string;
    selected: boolean;
    priority: number;
    work: () => Promise<void>;
}
