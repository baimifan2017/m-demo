class GUID {
  private str: string;

  constructor(str?: string) {
    this.str = str || GUID.getNewGUIDString();
  }

  toString() {
    return this.str;
  }

  private static getNewGUIDString() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

export default GUID;
