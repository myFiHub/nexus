/**
 * A simple lock implementation to prevent multiple simultaneous operations
 */
export class Lock {
  private locked = false;
  private completers: Array<() => void> = [];

  async synchronized<T>(action: () => Promise<T>): Promise<T> {
    if (this.locked) {
      await new Promise<void>((resolve) => {
        this.completers.push(resolve);
      });
    }

    this.locked = true;
    try {
      return await action();
    } finally {
      this.locked = false;
      if (this.completers.length > 0) {
        const completer = this.completers.shift()!;
        completer();
      }
    }
  }
}
