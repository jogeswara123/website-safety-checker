import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("dataset.csv")

# Use only features available in extension
X = df[[
    "UrlLength",
    "NumDots",
    "NumDash",
    "NoHttps"
]]

# Target
y = df["CLASS_LABEL"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Accuracy
pred = model.predict(X_test)

accuracy = accuracy_score(y_test, pred)

print(f"Accuracy: {accuracy * 100:.2f}%")

# Save
joblib.dump(model, "light_model.pkl")

print("light_model.pkl created")