## meemo

A fork of [lodash.memoize](https://www.npmjs.com/package/lodash.memoize) that avoids memory allocation churn and garbage collection

By [Adam Renklint](http://adamrenklint.com), September 2015. Made for use in [Bap](http://bapjs.org) and [Dilla](http://github.com/adamrenklint/dilla).

## License

MIT

## Changelog

- **1.0.0**
  - Initial release, move variable declaration outside of memoized function handler scope
- **1.1.0**
  - Use ```Map``` where available
- **1.1.1**
  - Fix issue with ```window``` reference in node.js
- **1.1.2**
  - Fix deopt issue ```Bad value context for arguments value```
