/**********************************************************************
 * Copyright (c) 2020 Robin Linus Woll                                *
 * Distributed under the MIT software license, see the accompanying   *
 * file COPYING or http://www.opensource.org/licenses/mit-license.php.*
 **********************************************************************/

'use strict';

// We use 48 bit integers 
// because 2 * 2**48 + 1 < Number.MAX_SAFE_INTEGER
const MAX_INT = 2 ** 48

export function fromHex(n) {

    // remove trailing "0x"
    n = n.replace(/^0x/, '')

    // pad input length to be a multiple of 12 
    // because 48 bit / 4 bit/nibble = 12 nibble
    if (n.length % 12) {
        const length = n.length - n.length % 12 + 12
        n = n.padStart(length, '0')
    }

    // split into chunks of size 12
    n = n.match(/(.{1,12})/g).reverse()

    // cast every chunk to a number
    return n.map(hex => parseInt(hex, 16))
}

export function toHex(n) {
    const hex = n.map(x => x.toString(16).padStart(12, '0')).reverse().join('')
    return '0x' + hex.replace(/^0+/, '')
}

export function toBinary(n) {
    n = n.map(m => m.toString(2).padStart(48, '0')).reverse().join('').replace(/^0+/, '')
    return n
}

/**
 * 
 * Big Integer Arithmetic
 * 
 */
export function add(a, b) {
    const result = []
    let carryOver = 0
    let length = Math.max(a.length, b.length)
    for (let i = 0; i < length; i++) {
        const a_i = a[i] || 0
        const b_i = b[i] || 0
        const sum = (a_i + b_i + carryOver)
        if (sum > MAX_INT - 1) {
            result[i] = sum - MAX_INT
            carryOver = 1 
        } else {
            result[i] = sum
            carryOver = 0
        }
    }
    if (carryOver) {
        result[length] = carryOver
    }
    return result
}

export function sub(a, b) {
    const result = []
    let carryOver = 0
    let length = Math.max(a.length, b.length)
    for (let i = 0; i < length; i++) {
        const x = a[i] || 0
        const y = (b[i] || 0) + carryOver
        if (x >= y) {
            result[i] = x - y
            carryOver = 0
        } else {
            result[i] = MAX_INT + x - y
            carryOver = 1
        }
    }
    return result
}

export function greater(a, b) {
    const length = Math.max(a.length, b.length) - 1
    for (let i = length; i >= 0; i--) {
        const x = a[i] || 0
        const y = b[i] || 0
        if (x > y) return true
        if (x < y) return false
    }
    return false
}

export function equals(a, b) {
    const length = Math.max(a.length, b.length) - 1
    for (let i = length; i >= 0; i--) {
        const x = a[i] || 0
        const y = b[i] || 0
        if (x !== y) return false
    }
    return true
}


/**
 * 
 * Big Integer Modulo Arithmetic
 * 
 */

export function mod_add(a, b, modulus) {
    if (!greater(modulus, a)) { // TODO: Here's a bug for a + b > 2 * modulus
        a = sub(a, modulus)
    }
    if (!greater(modulus, b)) { // TODO: Here's a bug for a + b > 2 * modulus
        b = sub(b, modulus)
    }
    let result = add(a, b)
    if (!greater(result, modulus)) { // TODO: Here's a bug for a + b > 2 * modulus
        return result
    }
    return sub(result, modulus)
}

export function mod_sub(a, b, modulus) {
    if (greater(a, b)) {
        return sub(a, b)
    } else {
        return add(a, sub(modulus, b))
    }
}

export function mod_mul(a, b, modulus) {
    b = toBinary(b)
    let result = []

    for (let i = b.length - 1; i >= 0; i--) {
        if (b[i] === '1') {
            result = mod_add(a, result, modulus)
        }
        a = mod_add(a, a, modulus)
    }

    return result
}

export function mod_exp(a, b, modulus) {
    b = toBinary(b)
    let result = [1]

    for (let i = b.length - 1; i >= 0; i--) {
        if (b[i] === '1') {
            result = mod_mul(result, a, modulus)
        }
        a = mod_mul(a, a, modulus)
    }

    return result
}

export function mod_inv(a, modulus) {
    const exp = sub(modulus, fromHex('0x02'))
    return mod_exp(a, exp, modulus)
}


export function mod_div(a, b, modulus) {
    return mod_mul(a, mod_inv(b, FIELD_MODULUS), FIELD_MODULUS)
}


/**
 *
 *    The Finite Field for Secp256k1
 * 
 */

const ELEM_0 = fromHex('0x00')
const ELEM_1 = fromHex('0x01')
const ELEM_2 = fromHex('0x02')
const ELEM_3 = fromHex('0x03')
const ELEM_4 = fromHex('0x04')

const FIELD_MODULUS = fromHex('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f')
const FIELD_MODULUS_SQRT = fromHex('0x3fffffffffffffffffffffffffffffffffffffffffffffffffffffffbfffff0c')

export function field_add(a, b) {
    return mod_add(a, b, FIELD_MODULUS)
}

export function field_sub(a, b) {
    return mod_sub(a, b, FIELD_MODULUS)
}

export function field_mul(a, b) {
    return mod_mul(a, b, FIELD_MODULUS)
}

export function field_div(a, b) {
    return mod_div(a, b, FIELD_MODULUS)
}

export function field_inv(a) {
    return mod_inv(a, FIELD_MODULUS)
}

export function field_exp(a, b) {
    return mod_exp(a, b, FIELD_MODULUS)
}

export function field_sqrt(a) {
    return field_exp(a, FIELD_MODULUS_SQRT)
}

export function field_neg(a) {
    return mod_add(a, FIELD_MODULUS, FIELD_MODULUS)
}

/**
 *
 *    The group of Curve Points of Secp256k1
 * 
 */
const b = fromHex('0x07')

const CURVE_GENERATOR = {
    x: fromHex('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'),
    y: fromHex('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8')
}

const CURVE_ORDER = fromHex('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141')

export function to_jacobian(P) {
    return [P.x, P.y, ELEM_1]
}

export function from_jacobian(p) {
    const z = field_inv(p[2])
    const z_2 = field_mul(z, z)
    const z_3 = field_mul(z_2, z)
    return { x: field_mul(p[0], z_2), y: field_mul(p[1], z_3) }
}

export function jacobian_double(p) {
    if (equals(p[1], ELEM_0))
        return [ELEM_0, ELEM_0, ELEM_1]
    const ysq = field_mul(p[1], p[1])
    const S = field_mul(field_mul(p[0], ysq), ELEM_4)
    const M = field_mul(field_mul(p[0], p[0]), ELEM_3)

    const nx = field_sub(field_mul(M, M), field_mul(S, ELEM_2))

    const ny = field_sub(field_mul(M, field_sub(S, nx)), field_mul(field_mul(ysq, ysq), fromHex('0x08')))

    const nz = field_mul(field_mul(p[1], ELEM_2), p[2])

    return [nx, ny, nz]
}

export function jacobian_add(p, q) {
    if (equals(p[1], ELEM_0))
        return q
    if (equals(q[1], ELEM_0))
        return p

    const p2_2 = field_mul(p[2], p[2])
    const p2_3 = field_mul(p2_2, p[2])

    const q2_2 = field_mul(q[2], q[2])
    const q2_3 = field_mul(q2_2, q[2])

    const U1 = field_mul(p[0], q2_2)
    const U2 = field_mul(q[0], p2_2)
    const S1 = field_mul(p[1], q2_3)
    const S2 = field_mul(q[1], p2_3)

    if (equals(U1, U2)) {
        if (!equals(S1, S2))
            return [ELEM_0, ELEM_0, ELEM_1]
        else
            return jacobian_double(p)
    }

    const H = field_sub(U2, U1)
    const R = field_sub(S2, S1)
    const H2 = field_mul(H, H)
    const H3 = field_mul(H, H2)
    const U1H2 = field_mul(U1, H2)
    const nx = field_sub(field_sub(field_mul(R, R), H3), field_mul(U1H2, ELEM_2))
    const ny = field_sub(field_mul(R, field_sub(U1H2, nx)), field_mul(S1, H3))
    const nz = field_mul(field_mul(H, p[2]), q[2])
    return [nx, ny, nz]
}

export function jacobian_multiply(P, s) {
    if (equals(P[1], ELEM_0) || equals(s, ELEM_0))
        return [ELEM_0, ELEM_0, ELEM_1]
    if (s === 1)
        return P

    s = toBinary(s)
    let result = [0, 0, 0]

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === '1') {
            result = jacobian_add(result, P)
        }
        P = jacobian_double(P)
    }
    return result
}

export function public_key(secret) {
    const P = from_jacobian(jacobian_multiply(to_jacobian(CURVE_GENERATOR), secret))
    return compress(P)
}

export function compress(P) {
    const x = P.x
    const orientation = x[0] % 2 ? '03' : '02'
    return orientation + toHex(x).replace(/^0x/, '')
}

export function decompress(hex) {
    const isEven = hex.substr(0, 2) === '03'
    hex = hex.substr(2)
    const x = fromHex(hex)

    let y = field_sqrt(field_add(field_mul(field_mul(x, x), x), b))

    if (isEven) {
        y = field_neg(y)
    }
    return { x: x, y: y }
}

