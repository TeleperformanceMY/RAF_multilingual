// Global Variables
let jsonData = [];
const languageSelect = document.getElementById('language-select');
const locationSelect = document.getElementById('location-select');
const jobSelect = document.getElementById('job-type-select');
const generatedLink = document.getElementById('generated-link');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const qrImg = document.getElementById('qrImg');
const bmsIdInput = document.getElementById('bms-id');

// Translation function
function translate(language) {
    const translations = {
        // Include your translations here
        // Example:
        english: {
            chooseLanguage: "Choose Your Language:",
            enterBMS: "Please key in your BMS ID",
            bmsIdPlaceholder: "Key in your BMS ID here.",
            chooseYourReferrerPreferred: "Please select your referral’s selection",
            languageLabel: "Language:",
            locationLabel: "Working location:",
            jobLabel: "Job Position:",
            nextButton: "Next",
            HowtoButton: "How To",
            thankYou: "Thank you for your referral!",
            referralMessage1: "As we grow into Malaysia, become #MoreTogether as we #ElevateAsia, here are the links your friend can use so this is tagged to your profile into our Recruiting System.",
            qrCodeMessage: "Or have your friend scan this code above!",
            vrMessage: "They can visit our locations in VR so they learn of us:",
            talentTeamMessage: "The Talent Attraction Team",
            BackButton: "Back"
        }
        // Add other languages
    };

    return translations[language];
}

// Update page content based on selected language
function updatePageContent(language) {
    const translations = translate(language);

    // Update labels and texts
    document.querySelector(".language-selection label").textContent = translations.chooseLanguage;
    document.querySelector("#step1 h2").textContent = translations.enterBMS;
    bmsIdInput.placeholder = translations.bmsIdPlaceholder;
    document.querySelectorAll("#step1 h2")[1].textContent = translations.chooseYourReferrerPreferred;
    document.querySelectorAll("#step1 label")[0].textContent = translations.languageLabel;
    document.querySelectorAll("#step1 label")[1].textContent = translations.locationLabel;
    document.querySelectorAll("#step1 label")[2].textContent = translations.jobLabel;
    document.querySelector("#step1 button").textContent = translations.nextButton;
    document.querySelector("#how-to-button").textContent = translations.HowtoButton;
    document.querySelector("#step2 h2").textContent = translations.thankYou;
    document.querySelector("#scan-code-button").textContent = translations.qrCodeMessage;
    document.querySelector("#referral-message").textContent = translations.referralMessage1;
    document.querySelector("#vr-message").textContent = translations.vrMessage;
    document.querySelector("#talent-team-message").textContent = translations.talentTeamMessage;
    document.querySelector("#step2 button").textContent = translations.BackButton;
}

// Function to update "How To" link with current language
function updateHowToLink(language) {
    const howToLink = document.querySelector("#how-to a");
    howToLink.href = `HowtoVid.html?lang=${language}`;
}

// Event Listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedLanguage = urlParams.get('lang') || localStorage.getItem('selectedLanguage') || 'english';

    // Update page content based on selected language
    updatePageContent(selectedLanguage);

    // Update "How To" link
    updateHowToLink(selectedLanguage);

    // Fetch JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            populatePreferredLanguages(jsonData);
            populateLocations(jsonData);
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // Event listener for language selection dropdown
    document.getElementById("emp-lang-select").addEventListener("change", function() {
        const selectedLanguage = this.value;
        updatePageContent(selectedLanguage);

        // Update the URL with the selected language
        const url = new URL(window.location);
        url.searchParams.set('lang', selectedLanguage);
        window.history.pushState({}, '', url);

        // Store the selected language in local storage
        localStorage.setItem('selectedLanguage', selectedLanguage);

        // Update "How To" link with the new language
        updateHowToLink(selectedLanguage);
    });

    // Event listeners for your selects
    languageSelect.addEventListener('change', function() {
        updateLocations();
        updateJobsDropdown();
    });

    locationSelect.addEventListener('change', function() {
        updateLanguages();
        updateJobsDropdown();
    });

    // Event listeners for share buttons
    setupShareButtons();
});

// Function to populate preferred languages based on JSON data
function populatePreferredLanguages(data) {
    const languages = [...new Set(data.map(item => item.Language))];
    populateDropdown(languageSelect, languages);
}

// Function to populate locations based on JSON data
function populateLocations(data) {
    const locations = [...new Set(data.map(item => item.Location))];
    populateDropdown(locationSelect, locations);
}

// Function to update locations based on selected language
function updateLocations() {
    const selectedLanguage = languageSelect.value;

    const filteredLocations = selectedLanguage
        ? [...new Set(jsonData.filter(item => item.Language === selectedLanguage).map(item => item.Location))]
        : [...new Set(jsonData.map(item => item.Location))];

    updateDropdownWithSelectedValue(locationSelect, filteredLocations, locationSelect.value);
}

// Function to update languages based on selected location
function updateLanguages() {
    const selectedLocation = locationSelect.value;

    const filteredLanguages = selectedLocation
        ? [...new Set(jsonData.filter(item => item.Location === selectedLocation).map(item => item.Language))]
        : [...new Set(jsonData.map(item => item.Language))];

    updateDropdownWithSelectedValue(languageSelect, filteredLanguages, languageSelect.value);
}

// Function to update the job dropdown based on both selected language and location
function updateJobsDropdown() {
    const selectedLanguage = languageSelect.value;
    const selectedLocation = locationSelect.value;

    if (selectedLanguage && selectedLocation) {
        const jobs = jsonData
            .filter(item => item.Language === selectedLanguage && item.Location === selectedLocation)
            .map(item => item.Positions);
        populateDropdown(jobSelect, jobs);
    } else {
        populateDropdown(jobSelect, []);
    }
}

// Function to populate a dropdown with options
function populateDropdown(dropdown, options) {
    dropdown.innerHTML = '<option value="">Select</option>';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        dropdown.appendChild(opt);
    });
}

// Function to update dropdown while keeping selected value
function updateDropdownWithSelectedValue(dropdown, options, currentValue) {
    populateDropdown(dropdown, options);
    if (options.includes(currentValue)) {
        dropdown.value = currentValue;
    } else {
        dropdown.value = '';
    }
}

// Move to the next step and display the generated link
function nextStep() {
    const bmsId = bmsIdInput.value.trim();
    if (!bmsId) {
        alert("Please enter a valid BMS ID.");
        return;
    }

    const selectedLanguage = languageSelect.value;
    const selectedLocation = locationSelect.value;
    const selectedJob = jobSelect.value;

    const jobData = jsonData.find(
        (item) =>
            item.Language === selectedLanguage &&
            item.Location === selectedLocation &&
            item.Positions === selectedJob
    );

    if (jobData) {
        const finalLink = jobData["Evergreen link"] + bmsId;
        generatedLink.innerHTML = `<a href="${finalLink}" target="_blank">${finalLink}</a>`;
        generateQrCode(finalLink);
    } else {
        alert("No matching job found. Please check your selections.");
        return;
    }

    step1.style.display = 'none';
    step2.style.display = 'block';
}

// Function to generate QR code
function generateQrCode(url) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    qrImg.src = qrCodeUrl;
}

// Function to set up share buttons
function setupShareButtons() {
    document.getElementById("share-button-whatsapp").addEventListener("click", function() {
        const message = "🌟 Exciting news! Join our amazing team at Teleperformance! 🌟 We're expanding our family and want you to be a part of it. Click the link below to start your new journey:";
        const message2 = "Let's grow together! 🚀 #JoinTheTeam";
        const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + "\n\n" + generatedLink.querySelector('a').href + "\n\n" + message2)}`;
        window.open(whatsappLink, "_blank");
    });

    document.getElementById("share-button-line").addEventListener("click", function() {
        const message = "🌟 Exciting news! Join our amazing team at Teleperformance! 🌟 We're expanding our family and want you to be a part of it. Click the link below to start your new journey:";
        const message2 = "Let's grow together! 🚀 #JoinTheTeam";
        const lineLink = `https://line.me/R/msg/text/?${encodeURIComponent(message + "\n\n" + generatedLink.querySelector('a').href + "\n\n" + message2)}`;
        window.open(lineLink, "_blank");
    });

    document.getElementById("share-button-facebook").addEventListener("click", function() {
        const facebookMessage = "🌟 Exciting news! Join our amazing team at Teleperformance! 🌟 We're expanding our family and want you to be a part of it.";
        const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generatedLink.querySelector('a').href)}&quote=${encodeURIComponent(facebookMessage)}`;
        window.open(facebookLink, "_blank", "width=600,height=400");
    });

    document.getElementById("share-button-IG").addEventListener("click", function() {
        alert("Instagram sharing is not supported via web browsers. Please share manually.");
    });

    document.getElementById("share-button-TikTok").addEventListener("click", function() {
        alert("TikTok sharing is not supported via web browsers. Please share manually.");
    });
}

// Function to refresh the page
function refreshPage() {
    location.reload();
}
