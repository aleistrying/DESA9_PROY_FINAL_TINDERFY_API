const mongoose = require("mongoose");
const { V4 } = require('paseto');
const crypto = require('crypto')
const { PRIVATE_KEY, JWT_ISSUER } = require("../config");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // age: { type: Number, required: true },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscriptions",
        default: null
    },
    gender: { type: String, required: true },
    birthday: { type: Date, required: true },
    likedSongs: { type: [String], default: [] },
    permissions: {
        type: {
            admin: { type: Boolean, default: false }
        },
        default: {}
    },
    // paymentToken: { type: String, default: null },
    dailySongsRequested: { type: Number, default: 0 },
    songLimit: { type: Number, default: 2 },
})

userSchema.methods.generateAuthToken = function () {
    try {
        return V4.sign({
            sub: this._id,
            iat: Date.now(),
            iss: JWT_ISSUER,
        }, PRIVATE_KEY, {
            expiresIn: "2 hours",
        })
    } catch (err) {
        console.log({ err })
        return null
    }
}

function validate(user) {
    if (typeof user.name !== "string" || user.name.length < 3)
        return { success: false, error: "El nombre del usuario debe ser valido y tener mas de 3 caracteres." }
    else if (typeof user.lastname !== "string" || user.lastname.length < 3)
        return { success: false, error: "El apellido del usuario debe ser valido y tener mas de 3 caracteres." }
    else if (typeof user.email !== "string" || !user.email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,10}$/ig))
        return { success: false, error: "El email del usuario debe ser valido." }
    else if (typeof user.password !== "string")
        return { success: false, error: "La contraseña del usuario debe ser valida." }
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\.])[A-Za-z\d@$!%*?&\.]{8,}$/g.test(user.password)) {
        if (!/^(?=.*[a-z])/g.test(user.password))
            return { success: false, error: "La contraseña debe tener al menos una letra minúscula." }
        else if (!/^(?=.*[A-Z])/g.test(user.password))
            return { success: false, error: "La contraseña debe tener al menos una letra mayúscula." }
        else if (!/^(?=.*\d)/g.test(user.password))
            return { success: false, error: "La contraseña debe tener al menos un número." }
        else if (!/^(?=.*[@$!%*?&\.])/g.test(user.password))
            return { success: false, error: "La contraseña debe tener al menos un caracter especial @$!%*?&." }
        else if (!/^(?=.*[A-Za-z\d@$!%*?&\.])[A-Za-z\d@$!%*?&\.]{8,}$/g.test(user.password))
            return { success: false, error: "La contraseña debe tener al menos 8 caracteres." };
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\.])[A-Za-z\d@$!%*?&\.]{8,}$/g.test(user.password))
            return { success: false, error: "La contraseña debe tener al menos una letra minúscula, una mayúscula, un número y un caracter especial @$!%*?&." }
    }
    // else if (typeof user.age !== "number"
    // && user.age >= 13 && user.age <= 120)
    // return { success: false, error: "La edad del usuario debe ser valida." }
    else if (typeof user.gender !== "string"
        && !["m", "f", "o"].includes(user.gender))
        return { success: false, error: "El genero del usuario debe ser valido." }
    else if (typeof new Date(user.birthday) !== "object"
        || new Date(user.birthday).toString() === "Invalid Date")
        return { success: false, error: "La fecha de nacimiento debe ser valida." }

    // for (let key in schema) {
    //     if (schema[key].required && !song[key])
    //         return { success: false, error: key + " es requerido." }
    //     else if (schema[key].type !== typeof song[key]
    //         //check if it's a valid date
    //         || (schema[key].type === "date" && typeof song[key] === "object"
    //             && !(song[key] instanceof Date) && new Date(song[key]).toString() === "Invalid Date"))
    //         return { success: false, error: key + " es de tipo invalido." }
    //     else if (schema[key].validate && !song[key].match(schema[key].regex))
    //         return { success: false, error: key + " es de tipo invalido." }
    // }
    return { success: true };
}
module.exports = { Users: mongoose.model("users", userSchema), validate }