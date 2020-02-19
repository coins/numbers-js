/**
 * Finite Field Arithmetic
 */

export function fromHex(n) {
    // remove trailing "0x"
    n = n.replace(/^0x/, '')

    // little endian conversion
    // The least significant bit should be the lowest.
    n = n.split('').reverse()

    // cast to number
    return n.map(hex => parseInt(hex, 16))
}

export function toHex(n) {
    return '0x' + n.map(x => x.toString(16)).reverse().join('')
}

export function toBinary(n) {
    n = n.map(m => m.toString(2).padStart(4, '0').split('').map(Number).reverse())
    n = n.flat()
    return n
}

export function add(a, b) {
    const result = []
    let carryOver = 0
    let length = Math.max(a.length, b.length)
    for (let i = 0; i < length; i++) {
        const a_i = a[i] || 0
        const b_i = b[i] || 0
        const sum = (a_i + b_i + carryOver)
        if (sum > 15) {
            result[i] = sum - 16
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
            result[i] = 16 + x - y
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

export function mod_add(a, b, modulus) {
    let result = add(a, b)
    if (greater(result, modulus)) { // TODO: Fix this for larger inputs
        result = sub(result, modulus)
    }
    return result
}

export function mod_mul(a, b, modulus) {
    b = toBinary(b)
    let result = []

    for (let i = 0; i < b.length; i++) {
        if (b[i]) {
            result = mod_add(result, a, modulus)
        }
        a = mod_add(a, a, modulus)
    }

    return result
}

export function mod_exp(a, b, modulus) {
    b = toBinary(b)
    let result = [1]

    for (let i = 0; i < b.length; i++) {
        if (b[i]) {
            result = mod_mul(result, a, modulus)
        }
        a = mod_mul(a, a, modulus)
    }

    return result
}