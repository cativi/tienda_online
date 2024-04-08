const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: String,
    // El Enum de MySQL funciona con un objeto
    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff'
    },
    cart: [{ type: Schema.Types.ObjectId, ref: 'product' }]
}, { versionKey: false, timeseries: true }
);

module.exports = model('user', userSchema);