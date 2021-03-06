# Numbers.js

Basic number theory using the native BigInt arithmetic.

## Extended Euclidean Algorithm
```javascript
const { egcd } = await import('https://coins.github.io/numbers-js/numbers.js');
egcd(42n, 14n)
```

## Modular Inverse
```javascript
const { mod_inv } = await import('https://coins.github.io/numbers-js/numbers.js');
mod_inv(2n, 101n)
```

## Modular Exponentiation
```javascript
const { mod_exp } = await import('https://coins.github.io/numbers-js/numbers.js');
mod_exp(2n, 42n, 11n)
```

## Modular Square Root
```javascript
const { mod_sqrt } = await import('https://coins.github.io/numbers-js/numbers.js');
mod_sqrt(16n, 43n)
```
