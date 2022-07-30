const fs = require('fs')
const { V4 } = require('paseto')
const { Users } = require('../../models/users')
const { PUBLIC_KEY } = require('../../config')
const path = require('path');

module.exports = async (req, res) => {
    const { query } = req
    // console.log("getting music", query)
    if (!query.name || query.name === "undefined") return res.status(400).json({ success: false, error: 'name is required' })
    else if (!query.token) return res.status(400).json({ success: false, error: 'token is required' })
    try {
        // const token = req.headers.authorization.split(" ")[1];
        const token = Buffer.from(query.token, "hex").toString("utf8")

        const verify = await V4.verify(token, PUBLIC_KEY, {
            maxTokenAge: '1h'
        });

        req.user = await Users.findById(verify.sub)

        if (!verify) {
            res.status(200).send({ success: false, error: "No tienes autorización", logout: true });
        }
    } catch (e) {
        console.log(e)
        return res.status(400).send({ success: false, error: "Token Invalido", logout: true });
    }

    try {

        //we don't really need to hash the names  it's just a simple app
        const filePath = path.join(__dirname, "../../music/" + query.name);
        // console.log(filePath)
        // const music = fs.readFileSync(filePath, 'binary')
        const mstream = fs.createReadStream(filePath)
        // console.log(music)
        res.on('close', () => {
            mstream.close()
        });
        res.on('end', () => {
            mstream.close()
        });
        res.on('finish', () => {
            mstream.close()
        });

        mstream.on('close', function () {
            res.end(0);
        });

        res.set('content-type', 'audio/mp3');
        // res.set('accept-ranges', 'bytes');
        const size = fs.statSync(filePath).size;
        res.set('content-length', size);
        mstream.pipe(res)
    } catch (e) {
        console.log(e)

    }
}