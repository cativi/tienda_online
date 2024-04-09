const { model, Schema } = require('mongoose');

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    department: String,
    available: Boolean,
    stock: Number,
    creator: { type: Schema.Types.ObjectId, ref: 'user' }
}, {
    versionKey: false, //desactiva el versionado
    timestamps: true //createAt / editedAt
});


module.exports = model('product', productSchema);