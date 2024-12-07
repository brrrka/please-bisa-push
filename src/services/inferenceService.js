const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            // .div(255)
            .expandDims()

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        // const confidenceScore = score[0] * 100;
        const label = score[0] > 0.5 ? 'Cancer' : 'Non-cancer';

        let suggestion;

        if (label === 'Cancer') {
            suggestion = "Segera periksa ke dokter!"
        }

        if (label === 'Non-cancer') {
            suggestion = "Penyakit kanker tidak terdeteksi."
        }

        return { label, suggestion };
    } catch {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`)
    }
}

module.exports = predictClassification;