export const apiRequest = async (url, method = "GET", body = null, params = {}, additionalHeaders = {},responsebody=true) => {
    const accessToken = localStorage.getItem("access_token"); // Retrieve JWT token

    // Convert params object into a query string if params exist
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Attach JWT token
        ...additionalHeaders, // Merge with any additional headers
    };

    const options = {
        method,
        headers,
        ...(body && method !== "GET" && { body: JSON.stringify(body) }), // Include body if not GET
    };

    try {
        const response = await fetch(fullUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        if (responsebody) {
            // Parse response JSON
            return await response.json();
        }
         
    } catch (error) {
        console.error("API Request Failed:", error);
        throw error; // Rethrow for handling
    }
};

