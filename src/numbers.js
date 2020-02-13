/**
 * Extended Euclidean Algorithm
 * 
 * @param {BigInt} m The first number 
 * @param {BigInt} n The second number
 * @return [BigInt, BigInt, BigInt] 
 *        a b Bézout coefficients 
 *        d the greatest common divisor 
 *
 */
export function egcd(m, n) {
    let a1 = 1n;
    let b1 = 0n;
    let a = 0n;
    let b = 1n;
    let c = m;
    let d = n;
    let q = c / d;
    let r = c % d;
    while (r > 0n) {
        let t = a1;
        a1 = a;
        a = t - q * a; // a1 - qa
        t = b1;
        b1 = b;
        b = t - q * b; // b1 - qb
        c = d;
        d = r;
        q = c / d;
        r = c % d;
    }
    return [a, b, d];
}


/**
 * !!Prime modulus!! Modular Inverse
 * 
 * @param {BigInt} x - The number
 * @param {BigInt} m - The modulus
 * @return {BigInt} The inverse of x
 * 
 */
export function mod_inv(x, m) {
    // TODO: fix mod_inv for composite m
    // 
    // const [a, b, g] = egcd(x, m)
    // if (g != 1n)
    //     throw Error('Inverse doesn\'t exist '+g)
    // return a
    // console.warn('mod_inv works only for prime fields')
    return mod_exp(x, m - 2n, m)
}

/**
 * Modular Exponentiation
 * 
 * @param {BigInt} a The base
 * @param {BigInt} b The exponent
 * @param {BigInt} m The modulus
 * @return {BigInt} The exponentiation
 *
 */
export function mod_exp(a, b, m) {
    a = a % m
    let result = 1n
    let x = a

    while (b > 0) {
        if (b & 1n) { // read the least significant bit
            result = result * x % m
        }

        b >>= 1n // cut off the least significant
        x = x * x % m
    }
    return result
}



/**
 * Modular Square Root
 * 
 * @param {BigInt} x The number
 * @param {BigInt} p The prime modulus
 * @return {BigInt} The square root of x
 *
 */
export function mod_sqrt(x, p) {
    // TODO: implement other square root algorithms
    if ((p % 4n) !== 3n) throw Error('Square root algorithm for (p mod 4 == 1) not implemented yet')
    return mod_exp(x, (p + 1n) / 4n, p)
}