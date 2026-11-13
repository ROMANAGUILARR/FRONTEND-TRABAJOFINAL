// Pruebas automatizadas de las reglas del registro (RF01). Se ejecutan con: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validarRegistro } from '../src/utils/validaciones.js'

const valido = () => ({
    nombre: 'José Ángel',
    apellido: 'Núñez Pérez',
    email: 'jose@correo.com',
    nombreUsuario: 'jose.nunez',
    pregunta: '¿En qué ciudad naciste?',
    respuesta: 'Lima',
    contrasena: 'secreta123',
    confirmarContrasena: 'secreta123',
})

test('acepta un registro con todos los datos correctos', () => {
    assert.equal(validarRegistro(valido()), null)
})

test('rechaza un nombre con números', () => {
    assert.equal(validarRegistro({ ...valido(), nombre: 'Ju4n' }), 'El nombre solo puede contener letras y espacios.')
})

test('rechaza un nombre de una sola letra', () => {
    assert.equal(validarRegistro({ ...valido(), nombre: 'J' }), 'El nombre debe tener entre 2 y 100 caracteres.')
})

test('rechaza un nombre de usuario corto o con espacios', () => {
    assert.equal(validarRegistro({ ...valido(), nombreUsuario: 'ab' }), 'El nombre de usuario debe tener entre 3 y 50 caracteres.')
    assert.match(validarRegistro({ ...valido(), nombreUsuario: 'mi usuario' }), /sin espacios/)
})

test('rechaza un correo sin dominio', () => {
    assert.equal(validarRegistro({ ...valido(), email: 'jose@correo' }), 'El correo electrónico no tiene un formato válido.')
})

test('rechaza una respuesta de seguridad vacía o de más de 50 caracteres', () => {
    assert.equal(validarRegistro({ ...valido(), respuesta: '   ' }), 'Escribe la respuesta a tu pregunta de seguridad.')
    assert.equal(validarRegistro({ ...valido(), respuesta: 'a'.repeat(51) }), 'La respuesta de seguridad debe tener como máximo 50 caracteres.')
})

test('rechaza contraseñas cortas, largas o que no coinciden', () => {
    assert.equal(validarRegistro({ ...valido(), contrasena: '123', confirmarContrasena: '123' }), 'La contraseña debe tener entre 6 y 72 caracteres.')
    assert.equal(validarRegistro({ ...valido(), contrasena: 'a'.repeat(73), confirmarContrasena: 'a'.repeat(73) }), 'La contraseña debe tener entre 6 y 72 caracteres.')
    assert.equal(validarRegistro({ ...valido(), confirmarContrasena: 'otra123' }), 'Las contraseñas no coinciden.')
})
