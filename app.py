from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import tensorflow as tf

app = Flask(__name__)
CORS(app)  


model = tf.keras.models.load_model("digit_recognition_model.h5")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        file = request.files["image"]
        file.save("digit.png")

        
        image = cv2.imread("digit.png", cv2.IMREAD_GRAYSCALE)
        image = cv2.resize(image, (28, 28))
        image = image.reshape(1, 28, 28, 1) / 255.0

       
        prediction = model.predict(image)
        digit = int(np.argmax(prediction))  

        print(f"✅ Prediction array: {prediction}")  
        print(f"✅ Predicted digit: {digit}")  

        return jsonify({"digit": digit})  

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
