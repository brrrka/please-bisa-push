const crypto = require('crypto');
const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const { db } = require('../config/firebase')

async function postPredictHandler(request, h) {
    const { image } = request.payload
    const { model } = request.server.app;

    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": suggestion,
        "createdAt": createdAt
    }

    await storeData(id, data)

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    })
    response.code(201);
    return response;
}

async function predictHistories(request, h) {
    try {
        const predictCollection = db.collection("predictions");
        const snapshot = await predictCollection.get();

        if (snapshot.empty) {
            return h.response({
                status: "success",
                data: [],
            });
        }

        const result = [];
        snapshot.forEach((doc) => {
            result.push({
                id: doc.id,
                history: doc.data(),
            });
        });

        return h.response({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.error("Error retrieving prediction histories:", error);
        throw new InputError("Gagal mengambil data prediksi.");
    }
}


module.exports = { postPredictHandler, predictHistories };