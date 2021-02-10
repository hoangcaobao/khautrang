const webcam = new Webcam(document.getElementById('webcam'));

let isPredicting = false;
async function predict() {
    const model = await tf.loadLayersModel("https://hoangcaobao.github.io/khautrang/backend/model.json")
    while (isPredicting) {
        const predictedvalue = tf.tidy(() => {
            const img = webcam.capture();

            const predictions = model.predict(img);


            return predictions
        });

        console.log(await predictedvalue.data())
        var probality = (await predictedvalue.data())[0];

        if (probality > 0.4) {
            probality = 2
        } else if (probality > 0.02) {
            probality = 1
        } else {
            probality = 0
        }

        var predictionText = "";
        switch (probality) {
            case 0:
                predictionText = "DONT WEAR";
                break;
            case 1:
                predictionText = "WEAR INCORRECTLY";

                break;
            case 2:
                alert("CONGRATULATION. YOU WEAR CORRECTLY")
                isPredicting = false;

                break;

        }
        document.getElementById("prediction").innerText = predictionText;


        predictedvalue.dispose();
        await tf.nextFrame();
    }
}



function startPredicting() {
    isPredicting = true;
    predict();
}

function stopPredicting() {
    isPredicting = false;
    predict();
}

async function init() {
    await webcam.setup();

    tf.tidy(() => webcam.capture());
}



init();
