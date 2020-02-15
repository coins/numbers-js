export function log2(n) {
    const bits = Math.round(n.toString(16).length / 2)
    return bits
}

export function log10(n) {
    const digits = n.toString().length - 1
    return digits
}

export function toHex(n) {
    let hex = this.n.toString(16)
    if (hex.length % 2) { hex = '0' + hex }
    return hex
}