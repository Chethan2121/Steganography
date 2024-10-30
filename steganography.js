// steganography.js

const Steganography = (() => {
    const CHAR_BIT = 8;

    function encode(message, img) {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;

        const binaryMessage = textToBinary(message) + "00000000"; // Null terminator to mark the end of the message
        let messageIndex = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            if (messageIndex < binaryMessage.length) {
                pixels[i] = (pixels[i] & 0xFE) | parseInt(binaryMessage[messageIndex], 10); // Modifying the red channel LSB
                messageIndex++;
            }
        }

        context.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

    function decode(img) {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;

        let binaryMessage = "";

        for (let i = 0; i < pixels.length; i += 4) {
            binaryMessage += (pixels[i] & 1).toString(); // Extracting the red channel LSB
        }

        return binaryToText(binaryMessage);
    }

    function textToBinary(text) {
        return text.split("").map(char => {
            return char.charCodeAt(0).toString(2).padStart(CHAR_BIT, "0");
        }).join("");
    }

    function binaryToText(binary) {
        const chars = [];
        for (let i = 0; i < binary.length; i += CHAR_BIT) {
            const byte = binary.slice(i, i + CHAR_BIT);
            if (byte === "00000000") break; // Stop at null terminator
            chars.push(String.fromCharCode(parseInt(byte, 2)));
        }
        return chars.join("");
    }

    return {
        encode,
        decode,
    };
})();
