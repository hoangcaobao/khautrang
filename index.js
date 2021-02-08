const webcam = new Webcam(document.getElementById('wc'));

let isPredicting = false;
async function predict() {
    const model = await tf.loadLayersModel("http://127.0.0.1:8887/model.json")
    while (isPredicting) {
        const predictedClass = tf.tidy(() => {
            const img = webcam.capture();

            const predictions = model.predict(img);


            return predictions
        });
        console.log(await predictedClass.data())
        var classId = (await predictedClass.data())[0];
        console.log(classId)
        if (classId > 0.1) {
            classId = 2
        } else if (classId > 0.003) {
            classId = 1
        } else {
            classId = 0
        }

        var predictionText = "";
        switch (classId) {
            case 0:
                predictionText = "Chưa đeo";
                break;
            case 1:
                predictionText = "Nhớ đeo che mũi";
                isPredicting = false;
                break;
            case 2:
                alert("Đã đeo thành công")
                    // alert("DA DEO THANH CONG")
                break;

        }
        document.getElementById("prediction").innerText = predictionText;


        predictedClass.dispose();
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