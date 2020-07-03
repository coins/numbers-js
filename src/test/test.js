import { mod_exp, mod_inv, mod_sqrt, egcd } from '../numbers.js'

describe('The numbers library', function() {

    it('can compute modular exponentiation', function() {
        const modulus = 59n
        expect(mod_exp(0n, 4n, modulus)).toBe(0n)
        expect(mod_exp(32n, 0n, modulus)).toBe(1n)
        expect(mod_exp(3n, 4n, modulus)).toBe(22n)
        expect(mod_exp(-3n, 5n, modulus)).toBe(52n)
    })

    it('can compute modular square root', function() {
        const modulus = 103n
        expect(mod_sqrt(0n, modulus)).toBe(0n)
        expect(mod_sqrt(32n, modulus)).toBe(49n)
        expect(mod_sqrt(3n, modulus)).toBe(93n)
    })

    it('can compute modular inverse for prime moduli', function() {
        const modulus = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')
        const n = -109976436843324558880964699563548738028614589060221026008063405243898306074619n
        const inv = mod_inv(n, modulus)
        expect(n * inv % modulus).toBe(1n)
    })

    it('can compute modular inverse for composite moduli', function() {
        const modulus = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141') - 1n
        const n = -109976436843324558880964699563548738028614589060221026008063405243898306074619n
        const inv = mod_inv(n, modulus)
        expect(n * inv % modulus).toBe(1n)
    })

})


import '../bigint-polyfill/test.js'