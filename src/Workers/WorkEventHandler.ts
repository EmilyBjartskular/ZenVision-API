
export interface IWorkEvent {
  on(key: string, handler: { (): void }): void;
  off(key: string)
}
/**
 * Work Events, using the Work interface to manipulates events that have work in its nature, can handle multiple observers
 */
export class WorkEventHandler implements IWorkEvent {
  private handlers: Map<string, [() => void]>;

  constructor() {
    this.handlers = new Map<string, [() => void]>();
  }
  public off(key: string) {
    if(this.handlers.has(key))
      this.handlers.delete(key);
  }

  public on(key: string, handler: () => void): void {
    if (this.handlers.has(key)) {
      this.handlers.get(key).push(handler);
    } else {
      this.handlers.set(key, [handler]);
    }
  }

  public run(key: string) {
    if(this.handlers.has(key))
      this.handlers.get(key).map((e) => e());
  }

  public expose(): IWorkEvent {
    return this;
  }
}
