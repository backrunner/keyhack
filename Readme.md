# ⌨ KeyHack

Use proxy to bind functions to combo keys, less than 3KB after gzip.

This library has integrated `mousetrap` which will provide the basic ability to bind functions to combo keys.

## 🔧 Usage

Step 1: Install this package.

```bash
npm install keyhack
```

Step 2: Import it to your project.

```js
// here's an example if you want to bind a function to "ctrl+s"
import { Ctrl } from 'keyhack';

Ctrl.S = () => {
  console.log('ctrl+s triggered').
};

// if you want to unbind it, do this
delete Ctrl.S;
```

We provide `Ctrl`, `Shift`, `Alt`, `Command`, `Option`, `Meta`, `Mod`(based on `mousetrap`, it will support cross-platform binding) as the first key in the combo.

If you want to custom your special combo key, you can do this:

```js
import { KeyHackFactory } from 'keyhack';

// for example, I want to build a "a+s" combo key
const A = KeyHackFactory('a');
A.S = () => {
  console.log('a+s triggered');
};
```

## License

MIT
