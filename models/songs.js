const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    song: { type: String, required: true },
    genre: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: Number, required: true },
});
function validate(song) {
    if (typeof song.name !== "string") return { success: false, error: "El nombre debe ser valido" };
    else if (song.name.length > 50) return { success: false, error: "El nombre no puede tener mas de 50 caracteres" };
    else if (typeof song.artist !== "string") return { success: false, error: "El nombre del artista debe ser valido" };
    else if (song.artist.length > 100) return { success: false, error: "El artista no puede tener mas de 100 caracteres" };
    else if (typeof song.duration !== "number") return { success: false, error: "La duracion debe ser un numero" };
    else if (typeof song.genre !== "string") return { success: false, error: "El genero debe ser valido" };
    else if (typeof song.song !== "string") return { success: false, error: "La cancion debe ser un string" };
    else if (typeof song.image !== "string") return { success: false, error: "La imagen debe ser un string" };

    // for (let key in schema) {
    //     if (schema[key].required && !song[key])
    //         return { success: false, error: `${key} es requerido` };
    //     else if (schema[key].type !== typeof song[key])
    //         return { success: false, error: `${key} es de tipo invalido` };
    // }
    return { success: true };
}
module.exports = { Songs: mongoose.model("songs", songSchema), validate };