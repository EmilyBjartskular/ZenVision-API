
export interface IEvent {
  on(key: string, handler: { (): void }): void;
  off(key: string)
}
export class EventHandler implements IEvent {
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

  public expose(): IEvent {
    return this;
  }
}
