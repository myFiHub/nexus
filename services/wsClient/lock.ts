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
      // Release all waiting operations
      const waitingCompleters = this.completers.splice(0);
      waitingCompleters.forEach((completer) => completer());
    }
  }
}
