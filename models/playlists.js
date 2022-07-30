const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const playListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: ObjectId, ref: "users", required: true },
    description: { type: String },
    songs: { type: Array, default: [], ref: "songs" },
    image: { type: String, default: "http://simpleicon.com/wp-content/uploads/playlist.png" },
    isDefault: { type: Boolean, default: false },
});
function validate(playlist) {
    if (typeof playlist.name !== "string")
        return { success: false, error: "El nombre debe ser valido." };
    else if (playlist.name.length > 50)
        return { success: false, error: "El nombre no puede tener mas de 50 caracteres." };
    else if (typeof playlist.userId !== "string")
        return { success: false, error: "El id del usuario debe ser valido." };
    else if (!mongoose.Types.ObjectId.isValid(playlist.userId))
        return { success: false, error: "El id del usuario es invalido." };
    else if (typeof playlist.description !== "string")
        return { success: false, error: "La duracion debe ser un numero" };
    else if (playlist.description.length >= 500)
        return { success: false, error: "La descripcion no puede tener mas de 500 caracteres" };
    else if (typeof playlist.image !== "string")
        return { success: false, error: "La imagen debe ser un string" };
    else if (typeof playlist.isDefault !== "boolean"
        && /true|false/i.test(String(playlist.isDefault)))
        return { success: false, error: "El valor debe ser un boolean" };
    // for (let key in schema) {
    //     if (schema[key].required && !playList[key])
    //         return { success: false, error: `${key} es requerido` };
    //     else if (schema[key].type !== typeof playList[key])
    //         return { success: false, error: `${key} es de tipo invalido` };
    // }
    return { success: true };
}

module.exports = { Playlists: mongoose.model("playlists", playListSchema), validate }