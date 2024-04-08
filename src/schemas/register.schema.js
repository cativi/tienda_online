const yup = require('yup');

const registerSchema = yup.object({
    name: yup.string()
        .min(3, 'Mínimo 3 caracteres')
        .required('Campo requerido'),
    email: yup.string()
        // validamos email con expresión regular en lugar de con .email, porque esta validación es más completa
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        .required('Email requerido'),
    password: yup.string()
        .required('Contraseña requerida')
})

module.exports = registerSchema;