import LZString from 'lz-string';

class Local {
  get(key, defaultValue) {
    const item = window.localStorage.getItem(LZString.compress(key));

    return (item === null) ? defaultValue : JSON.parse(LZString.decompress(item));
  }

  set(key, value) {
    window.localStorage.setItem(LZString.compress(key), LZString.compress(JSON.stringify(value)));
  }

  del(key) {
    window.localStorage.removeItem(LZString.compress(key));
  }

  clear() {
    window.localStorage.clear();
  }

  get theme() {
    const theme = this.get('theme', { id: 'ebanux', mode: 'light' });
    return (typeof theme === 'string') ? { id: theme, model: 'light' } : theme;
  }

  setTheme(value) {
    this.set('theme', value);
  }
}

const local = new Local();

export default local;
