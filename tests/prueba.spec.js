function sumar(num1, num2) {
    return num1 + num2;
}


describe('Test de prueba', () => {

    it('Probando que la función sumar devuelva un resultado', () => {
        const resultado = sumar(3, 5);
        expect(resultado).toBe(8);
        expect(sumar(7, 2)).toBe(9);
    });

});