export abstract class ClassState<T> {
  protected updateState: () => void;

  public set() {
    if (!this.updateState) throw new Error("stateSetter is not defined");

    this.updateState();
  }

  private init(stateSetter: () => void): this {
    if (typeof this.updateState === "function") {
      throw new Error("Class already initialized");
    }
    this.updateState = stateSetter;
    return this;
  }

  abstract get(): T;
}
