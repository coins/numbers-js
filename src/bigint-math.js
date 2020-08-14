/**
 * Logarithm base 2 of a BigInt n.
 * @param  {BigInt} n - The input
 * @return {Number} - the logarithm of n
 */
export function log2(n) {
    const bytes = Math.round(n.toString(16).length / 2)
    return bytes * 8
}

/**
 * Logarithm base 10 of a BigInt n.
 * @param  {BigInt} n - The input
 * @return {Number} - the logarithm of n
 */
export function log10(n) {
    const digits = n.toString().length - 1
    return digits
}

/**
 * Convert a BigInt to hex
 * @param  {BigInt} n - The input
 * @return {String} - the hex encoded result
 */
export function toHex(n) {
    let hex = this.n.toString(16)
    if (hex.length % 2) 
        hex = '0' + hex
    return hex
}

import { toBigInt, randomBytes } from '../../../buffer-js/buffer.js'

/**
 * Generate a secure random BigInt between 0 and limit.
 * @param  {BigInt} limit - The upper limit of the range
 * @return {BigInt} - a random value within the range
 */
export function randomBigInt(limit) {
    let randomValue = limit
    const byteSize = Math.ceil(log2(limit) / 8)
    while (randomValue >= limit) {
        randomValue = toBigInt(randomBytes(byteSize))
        // TODO: prevent infinite loop
    }
    return randomValue
}