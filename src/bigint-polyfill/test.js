import {toHex, fromHex, add, sub, mod_add, mod_mul, mod_inv, mod_exp, public_key, decompress, compress, equals} from './bigint-polyfill.js'

describe('The BigInt library', function() {

    it('can compute addition with overflow', function() {

        const a = '0xffffffffffffffffff'
        const b = '0xffffffffffffffffff'

        const result = toHex(add(fromHex(a), fromHex(b)))

        expect(result).toBe('0x1fffffffffffffffffe')
    })

    it('can compute addition', function() {

        const a = '0xffffffffffff01'
        const b = '0xffffffffff02'

        const result = toHex(add(fromHex(a), fromHex(b)))

        expect(result).toBe('0x100fffffffffe03')
    })

    it('can compute addition of larger numbers', function() {

        const a = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141'
        const b = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'

        const result = toHex(add(fromHex(a), fromHex(b)))

        expect(result).toBe('0x1fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8bd0363d70')
    })

    it('can compute subtraction with overflow', function() {

        const a = '0xffffffffffffff'
        const b = '0xffffffffffffff'

        const result = toHex(sub(fromHex(a), fromHex(b)))

        expect(result).toBe('0x')
    })

    it('can compute subtraction', function() {

        const a = '0xffffffffffff01'
        const b = '0xffffffffff02'

        const result = toHex(sub(fromHex(a), fromHex(b)))

        expect(result).toBe('0xfeffffffffffff')
    })

    it('can compute subtraction of larger numbers', function() {
        const a = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')
        const b = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')

        const result = toHex(sub(a, b))

        expect(result).toBe('0x14551231950b75fc4402da1722fc9baee')
    })

    it('can add and then subtraction larger numbers', function() {
        const a = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')
        const b = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')

        const result = toHex(sub(add(a, b), b))

        expect(result).toBe('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f')
    })

    it('can compute modular addition', function() {

        const a = fromHex('0xffffffffffff01')
        const b = fromHex('0xffffffffff02')
        const p = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'

        const result = toHex(mod_add(a, b, p))

        expect(result).toBe('0x100fffffffffe03')
    })

    it('can compute modular addition of larger numbers', function() {
        const a = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFCAA')
        const b = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')
        const p = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')

        const result = toHex(mod_add(a, b, p))

        expect(result).toBe('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd03641bc')
    })

    it('can compute modular addition of larger numbers', function() {
        const a = fromHex('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f')
        const b = fromHex('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f')
        const p = fromHex('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f')

        const result = toHex(mod_add(a, b, p))

        expect(result).toBe('0x')
    })

    it('can compute modular addition with zero', function() {
        const a = fromHex('0x0')
        const b = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')
        const p = fromHex('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffcaa')

        const result = toHex(mod_add(a, b, p))

        expect(result).toBe('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f')
    })


    it('can compute modular multiplication of larger numbers', function() {
        const a = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC')
        const b = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')
        const p = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')

        const result = toHex(mod_mul(a, b, p))

        expect(result).toBe('0x120000000000000000000000000000003bb9e571a5d1aa9507c860a3e4c6090d')
    })

    it('can compute modular exponentiation', function() {
        const a = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC')
        const b = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')
        const p = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')

        const result = toHex(mod_exp(a, b, p))

        expect(result).toBe('0x30c1194adcab3aea0d6e1399b3ed5e00755ac148f3bae801f9b65aadead3e9d4')
    })

    it('can compute modular inverse', function() {
        const a = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC')
        const p = fromHex('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')

        const inv = mod_inv(a, p)

        const result = toHex(mod_mul(a, inv, p))

        expect(result).toBe('0x1')
    })

})


describe('Secp256k1', function() {

    it('can compute curve points', function() {
        const secret = fromHex('0x18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725')

        const result = public_key(secret)

        expect(result).toBe('0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352')
    })

    it('can compress and decompress curve points', function() {
        const secret = fromHex('0x28e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a20632178')

        const compressed = public_key(secret)
        const decompressed = decompress(compressed)
        const result = compress(decompressed)

        expect(equals(result, compressed)).toBe(true)
    })
})