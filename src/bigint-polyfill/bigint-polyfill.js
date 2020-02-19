export function fromHex(n) {
    // remove trailing "0x"
    n = n.replace(/^0x/, '')

    // little endian conversion
    n = n.split('').reverse()

    // cast to number
    return n.map(hex => parseInt(hex, 16))
}

export function toHex(n) {
    return '0x' + n.map(x => x.toString(16)).reverse().join('')
}

export function add(a, b) {
    const c = []
    let z = 0
    let i = 0
    for (; i < Math.max(a.length, b.length); i++) {
        const x = a[i] || 0
        const y = b[i] || 0
        const z0 = (x + y + z)
        c[i] = z0 % 16
        z = (z0 / 16) ^ 0 // integer division
    }
    if (z) {
        c[i] = z
    }
    return c
}

export function sub(a, b) {
    const c = []
    let z = 0
    let i = 0
    for (; i < Math.max(a.length, b.length); i++) {
        const x = a[i] || 0
        const y = (b[i] || 0) + z
        if (x >= y) {
            c[i] = x - y
            z = 0
        } else {
            c[i] = 16 + x - y
            z = 1
        }
    }
    if (z) {
        c[i] = z
    }
    return c
}

export function greater(a, b) {
    const l = Math.max(a.length, b.length) - 1
    for (let i = l; i >= 0; i--) {
        const x = a[i] || 0
        const y = b[i] || 0
        if (x > y) return true
        if (x < y) return false
    }
    return false
}

export function mod_add(a, b, p) {
    let c = add(a, b)
    while (greater(c, p)) {
        c = sub(c, p)
    }
    return c
}

export function to_binary(n) {
    n = n.map(m => m.toString(2).padStart(4, '0').split('').map(Number).reverse())
    n = n.flat()
    return n
}

export function mod_mul(a, b, p) {

    let result = []

    b = to_binary(b)
    for (let i = 0; i < b.length; i++) {
        if (b[i]) {
            result = mod_add(result, a, p)
        }
        a = mod_add(a, a, p)
    }

    return result
}

export function mod_exp(a, b, p) {

    let result = [1]

    b = to_binary(b)
    for (let i = 0; i < b.length; i++) {
        if (b[i]) {
            result = mod_mul(result, a, p)
        }
        a = mod_mul(a, a, p)
    }

    return result
}