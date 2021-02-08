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
                predictionText = "Chưa đeo";
                break;
            case 1:
                predictionText = "Nhớ đeo che mũi";

                break;
            case 2:
                alert("CHÚC MỪNG. BẠN ĐÃ ĐEO ĐÚNG CÁCH")
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
