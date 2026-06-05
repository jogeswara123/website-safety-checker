from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load lightweight model
model = joblib.load("light_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.json

        df = pd.DataFrame([{
            "UrlLength": data["url_length"],
            "NumDots": data["num_dots"],
            "NumDash": data["num_hyphens"],
            "NoHttps": 0 if data["https"] == 1 else 1
        }])

        prediction = model.predict(df)

        return jsonify({
            "prediction": int(prediction[0]),
            "result":
                "⚠ Phishing Website"
                if prediction[0] == 1
                else "✅ Safe Website"
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)