// Pruebas automatizadas del vencimiento de la sesión (token JWT de 8 horas). Se ejecutan con: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { leerVencimiento, tokenVencido } from '../src/utils/sesion.js'

// Arma un JWT de prueba con el vencimiento indicado (en segundos)
function tokenConVencimiento(expSegundos) {
    const codificar = (objeto) => Buffer.from(JSON.stringify(objeto)).toString('base64url')
    return `${codificar({ alg: 'HS256' })}.${codificar({ sub: 'ana', exp: expSegundos })}.firma`
}

const AHORA = Date.UTC(2026, 10, 12, 15, 0, 0)

test('lee la fecha de vencimiento del token', () => {
    const token = tokenConVencimiento(AHORA / 1000 + 3600)
    assert.equal(leerVencimiento(token), AHORA + 3600 * 1000)
})

test('un token vigente no está vencido', () => {
    assert.equal(tokenVencido(tokenConVencimiento(AHORA / 1000 + 60), AHORA), false)
})

test('un token cuya hora de vencimiento ya pasó está vencido', () => {
    assert.equal(tokenVencido(tokenConVencimiento(AHORA / 1000 - 1), AHORA), true)
})

test('sin token, con un token ilegible o con el token demo no se cierra la sesión', () => {
    assert.equal(tokenVencido(null, AHORA), false)
    assert.equal(tokenVencido('no-es-un-jwt', AHORA), false)
    assert.equal(tokenVencido('demo-token-admin', AHORA), false)
})
