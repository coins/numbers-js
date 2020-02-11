import { mod_exp, mod_inv, mod_sqrt, egcd } from '../numbers.js'

describe('The numbers library', function() {

    it('can compute modular exponentiation', function() {
        const modulus = 59n;
        expect(mod_exp(0n, 4n, modulus)).toBe(0n)
        expect(mod_exp(32n, 0n, modulus)).toBe(1n)
        expect(mod_exp(3n, 4n, modulus)).toBe(22n)
    })

    it('can compute modular square root', function() {
        const modulus = 103n;
        expect(mod_sqrt(0n, modulus)).toBe(0n)
        expect(mod_sqrt(32n, modulus)).toBe(49n)
        expect(mod_sqrt(3n, modulus)).toBe(93n)
    })

})