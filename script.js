// Encrypts the message into the selected image
function encryptMessage() {
    const imageInput = document.getElementById("imageInput");
    const message = document.getElementById("messageInput").value;

    if (imageInput.files && imageInput.files[0] && message) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const image = new Image();
            image.onload = function () {
                const encryptedDataUrl = Steganography.encode(message, image);
                const encryptedImage = document.getElementById("encryptedImage");
                encryptedImage.src = encryptedDataUrl;
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        alert("Please select an image and enter a message to encrypt.");
    }
}

// Download the encrypted image
function downloadEncryptedImage() {
    const encryptedImage = document.getElementById("encryptedImage");
    const dataUrl = encryptedImage.src;

    if (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "encrypted-image.png";
        document.body.appendChild(link);  // Append the link to the body
        link.click();
        document.body.removeChild(link);  // Remove the link after downloading
    } else {
        alert("No encrypted image to download.");
    }
}

// Decrypts the hidden message from the uploaded encrypted image
function decryptMessage() {
    const encryptedImageInput = document.getElementById("encryptedImageInput");

    if (encryptedImageInput.files && encryptedImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const image = new Image();
            image.onload = function () {
                const decryptedMessage = Steganography.decode(image);
                document.getElementById("decryptedMessage").innerText = decryptedMessage || "No hidden message found.";
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(encryptedImageInput.files[0]);
    } else {
        alert("Please select an encrypted image to decrypt.");
    }
}
