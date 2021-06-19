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
 * Modular absolute value. 
 * Adds the modulus until the value becomes positive.
 * 
 * @param {BigInt} x The element
 * @return {BigInt} The element's absolute value.
 *
 */
export function mod_abs(x, m) {
    while (x < 0)
        x = (m + x) % m
    return x
}

/**
 * Modular Inverse
 * 
 * @param {BigInt} x - The number
 * @param {BigInt} m - The modulus
 * @return {BigInt} The inverse of x
 * 
 */
export function mod_inv(x, m) {
    x = mod_abs(x, m)
    const [a, b, g] = egcd(x, m)
    if (g != 1n)
        throw Error(`Inverse of ${x} doesn\'t exist mod ${m}`)
    return a
}

/**
 * Modular Exponentiation
 * 
 * @param {BigInt} a - The base
 * @param {BigInt} b - The exponent (must be positive)
 * @param {BigInt} m - The modulus
 * @return {BigInt} The exponentiation
 *
 */
export function mod_exp(a, b, m) {
    if (b < 0n)
        throw Error(`Exponent must be positive`)

    a = mod_abs(a, m)
    let result = 1n

    while (b > 0) {
        if (b & 1n) { // read the least significant bit
            result = result * a % m
        }

        b >>= 1n // cut off the least significant
        a = a * a % m
    }
    return result
}



/**
 * 
 * Legendre symbol 
 * Define if a is a quadratic residue modulo odd prime 
 * http://en.wikipedia.org/wiki/Legendre_symbol
 * 
 */
function legendre_symbol(a, p) {
    ls = mod_exp(a, (p - 1n) / 2n, p)
    if (ls == p - 1n)
        return -1n
    return ls
}

/**
 *
 * Square root modulo prime number  
 * Solve the equation 
 * x^2 = a mod p and return list of x solutions 
 * http://en.wikipedia.org/wiki/Tonelli-Shanks_algorithm
 * 
 */
function sqrt(a, p) {
    if (!p || p < 0n )
        throw Error(`p must be a positive prime number`)

    a = abs(a,p)

    // Simple case
    if (a == 0n)
        return [0]
    if (p == 2n)
        return [a]

    // Check solution existence on odd prime
    if (legendre_symbol(a, p) != 1n)
        throw Error(`There is no square root of ${a} mod ${p}`)

    // Simple case
    if (p % 4n == 3n) {
        const x = mod_exp(a, (p + 1n) / 4n, p)
        return [x, p - x]
    }

    // Factor p-1 on the form q * 2^s (with Q odd)
    [q, s] = [p - 1n, 0]
    while (q % 2n == 0n) {
        s += 1n
        q /= 2n
    }


    // Select a z which is a quadratic non residue modulo p
    let z = 1n
    while (legendre_symbol(z, p) != -1n) {
        z += 1n
    }
    let c = mod_exp(z, q, p)

    // Search for a solution
    let x = mod_exp(a, (q + 1n) / 2n, p)
    let t = mod_exp(a, q, p)
    let m = s
    while (t != 1n) {
        // Find the lowest i such that t^(2^i) = 1
        let [i, e] = [1n, 2n]
        for (i = 1n; i < m; i++) {
            if (mod_exp(t, e, p) == 1n)
                break
            e *= 2n
        }

        // Update next value to iterate
        let b = mod_exp(c, 2n ** (m - i - 1n) % (p - 1n), p)
        x = (x * b) % p
        t = (t * b * b) % p
        c = (b * b) % p
        m = i
    }

    return [x, p - x]
}
