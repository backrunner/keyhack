import Mousetrap from 'mousetrap';

interface KeyHackFunction extends Function {
  [keyName: string]: any;
}
interface KeyHackInner {
  key: any;
  fire: () => void;
  [keyName: string]: KeyHackInner | KeyHackFunction;
}

type KeyHackTarget = (e: Mousetrap.ExtendedKeyboardEvent, combo: string) => unknown;

const binded: Record<string, KeyHackTarget> = {};

const FireMethodFactory = (key: string) => {
  return () => Mousetrap.trigger(key);
};

export const KeyHackFactory = (key: string): KeyHackInner => {
  return new Proxy<KeyHackInner>(
    { key: key as any, fire: FireMethodFactory(key) },
    {
      get: function (target, prop) {
        if (typeof prop === 'symbol') {
          throw new Error('Key name should be a string.');
        }
        if (prop === 'key') {
          return target.key;
        }
        if (!target[prop]) {
          target[prop] = KeyHackFactory(`${key}+${prop.toLowerCase()}`);
        }
        return target[prop];
      },
      set: function (target, prop, value: KeyHackTarget) {
        if (typeof prop === 'symbol') {
          throw new TypeError('Key name should be a string.');
        }
        // init keyhack inner
        if (!target[prop]) {
          target[prop] = KeyHackFactory(`${key}+${prop.toLowerCase()}`);
        }
        if (typeof value === 'function') {
          const keyName = target[prop].key;
          if (binded[keyName]) {
            return false;
          }
          binded[keyName] = value;
          Mousetrap.bind(keyName, value);
        }
        return true;
      },
      deleteProperty: function (target, prop) {
        if (typeof prop === 'symbol') {
          throw new TypeError('Key name should be a string.');
        }
        if (!target[prop]) {
          return false;
        }
        const keyName = target[prop].key;
        if (!binded[keyName]) {
          return false;
        }
        delete binded[keyName];
        Mousetrap.unbind(keyName);
        return true;
      },
    },
  );
};

export const Ctrl = KeyHackFactory('ctrl');
export const Shift = KeyHackFactory('shift');
export const Alt = KeyHackFactory('alt');
export const Command = KeyHackFactory('command');
export const Option = KeyHackFactory('option');
export const Meta = KeyHackFactory('meta');
export const Mod = KeyHackFactory('mod');
