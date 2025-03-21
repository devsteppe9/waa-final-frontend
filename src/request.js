export const apiRequest = async (url, method = "GET", body = null, params = {}, additionalHeaders = {}, json = true) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve JWT token

    // Convert params object into a query string if params exist
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const headers = Object.keys(additionalHeaders).length > 0
        ? additionalHeaders
        : {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Attach JWT token
        };
    if (!json) {
        console.log(body);
        return;
    }

    const options = {
        method,
        headers,
        ...(body && method !== "GET" && { body: json ? JSON.stringify(body) : body }), // Include body if not GET
    };

    try {
        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (response) {
            return response.status === 204 ? null : await response.json(); // Parse response JSON
        }
    } catch (error) {
        console.error("API Request Failed:", error);
        throw error; // Rethrow for handling
    }
};

