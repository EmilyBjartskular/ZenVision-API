
export default interface Work {
    id: string;
    selected: boolean;
    priority: number;
    work: () => Promise<void>;
}
