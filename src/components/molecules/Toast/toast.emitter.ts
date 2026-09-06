class Emitter<T> {
  protected subscribers: Array<(data: T) => void> = [];

  subscribe = (subscriber: (data: T) => void) => {
    this.subscribers.push(subscriber);

    return () => {
      const index = this.subscribers.indexOf(subscriber);

      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  };

  protected publish = (data: T) => {
    this.subscribers.forEach((subscriber) => subscriber(data));
  };
}

export { Emitter };
