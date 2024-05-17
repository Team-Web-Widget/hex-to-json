// Optimized hexToBytes function
function hexToBytes(hex) {
    if (hex.startsWith('0x')) {
        hex = hex.slice(2);
    }
    
    const length = hex.length;
    const bytes = new Uint8Array(length / 2);

    for (let i = 0; i < length; i += 2) {
        bytes[i / 2] = (parseInt(hex[i], 16) << 4) | parseInt(hex[i + 1], 16);
    }

    return bytes;
}

/**
 * Decodes a hex string and extracts JSON data.
 * @param {string} hexStr - The hex string to decode.
 * @returns {Object} - The parsed JSON object.
 * @throws Will throw an error if the JSON parsing fails.
 */
export function decodeHexToJson(hexStr) {
    // Convert hex to bytes
    const bytesData = hexToBytes(hexStr);

    // Slice to remove the first 32 bytes (padding) and get the remaining bytes
    const remainingBytes = bytesData.slice(32);

    // Convert bytes to string directly using TextDecoder for better performance
    const textDecoder = new TextDecoder("utf-8");
    const jsonString = textDecoder.decode(remainingBytes);

    // Find and extract the JSON data
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}') + 1;

    if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonData = jsonString.substring(jsonStart, jsonEnd);
        try {
            const parsedData = JSON.parse(jsonData);
            return parsedData;
        } catch (e) {
            throw new Error("Error parsing JSON: " + e.message);
        }
    } else {
        throw new Error("JSON data not found in the bytes");
    }
}
