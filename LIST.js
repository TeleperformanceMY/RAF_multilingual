// Define referralLink variable
var referralLink;

// Function to generate referral link and display QR code
function generateReferralLinkAndQRCode() {
    // Generate referral link dynamically
    referralLink = jobOffersReferralLinks[selectedJobType] + bmsId;

    // Display link and generate QR code
    document.getElementById("generated-link").innerHTML = `<a href="${referralLink}" target="_blank">${referralLink}</a>`;
    generateQrCode(referralLink);

    // Hide Step 1 and show Step 2
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
}

// Call function to generate referral link and display QR code
generateReferralLinkAndQRCode();

// Event listener for WhatsApp share button
document.getElementById("share-button-whatsapp").addEventListener("click", function() {
    const message = "We are happy to have you with us. Check out this link: " + referralLink;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
});

// Event listener for Line share button
document.getElementById("share-button-line").addEventListener("click", function() {
    const message = "We are happy to have you with us. Check out this link: " + referralLink;
    const lineLink = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
    window.open(lineLink, "_blank");
});
