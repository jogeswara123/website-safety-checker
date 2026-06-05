async function checkWebsite() {

    try {

        let [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const url = tab.url;

        const features = {
            url_length: url.length,
            num_dots: (url.match(/\./g) || []).length,
            num_hyphens: (url.match(/-/g) || []).length,
            https: url.startsWith("https") ? 1 : 0
        };

        document.getElementById("result").innerHTML =
            "<p>🔍 Analyzing website...</p>";

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(features)
            }
        );

        const data = await response.json();

        console.log("API Response:", data);

        if (data.error) {
            document.getElementById("result").innerHTML = `
                <p class="danger">
                    ❌ ${data.error}
                </p>
            `;
            return;
        }

        let statusClass =
            data.prediction === 1
                ? "danger"
                : "safe";

        document.getElementById("result").innerHTML = `
            <p><strong>URL:</strong></p>
            <p>${url}</p>

            <hr>

            <p><strong>URL Length:</strong> ${features.url_length}</p>
            <p><strong>Dots:</strong> ${features.num_dots}</p>
            <p><strong>Hyphens:</strong> ${features.num_hyphens}</p>
            <p><strong>HTTPS:</strong> ${features.https ? "Yes" : "No"}</p>

            <hr>

            <p class="${statusClass}">
                <strong>${data.result}</strong>
            </p>
        `;

    } catch (error) {

        console.error("Fetch Error:", error);

        document.getElementById("result").innerHTML = `
            <p class="danger">
                ❌ Cannot connect to Flask server
            </p>

            <p>
                Make sure app.py is running on port 5000
            </p>

            <p style="font-size:12px;">
                ${error.message}
            </p>
        `;
    }
}

checkWebsite();