const yup = require('yup');

const productSchema = yup.object({

    name: yup.string()
        .required('El nombre es requerido'),
    description: yup.string()
        .min(10),
    price: yup.number()
        .required('El precio es requerido')
})

module.exports = productSchema;