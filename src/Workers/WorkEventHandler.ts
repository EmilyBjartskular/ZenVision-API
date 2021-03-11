import Work from "./Work";

export default interface IWorkEvent {
  on(key: string, handler: { (): void }): void;
}

export default class WorkEventHandler implements IWorkEvent {
  private handlers: Map<string, [() => void]>;

  constructor() {
    this.handlers = new Map<string, [() => void]>();
  }

  public on(key: string, handler: () => void): void {
    if (this.handlers.has(key)) {
      this.handlers.get(key).push(handler);
    } else {
      this.handlers.set(key, [handler]);
    }
  }

  public run(key: string) {
    this.handlers.get(key).map((e) => e());
  }

  public expose(): IWorkEvent {
    return this;
  }
}
