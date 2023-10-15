document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const inputField = document.getElementById("voucher-code");
    const submitButton = form.querySelector("button");
    const h1 = document.querySelector("h1");
    const paragraph = form.querySelector("p");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Disable the input field and button
        inputField.disabled = true;
        submitButton.disabled = true;
        submitButton.textContent = "Wird geprüft...";

        const requestData = {
            user: "webform",
            code: inputField.value
        };

        try {
            const response = await fetch("https://europe-west3-jetztundhier-48225.cloudfunctions.net/validateVoucherCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });
        
            const data = await response.json();
            console.log(data);
        
            if (!response.ok) {
                throw new Error(data.error || response.statusText);
            }
        
            // Voucher is valid
            let h1Element = document.querySelector("h1");
            let paragraphElement = document.querySelector("p");
            let formElement = document.querySelector("form");
            let inputFieldElement = document.getElementById("voucher-code");
            let submitButtonElement = form.querySelector("button");

            h1Element.textContent = "Dein Gutschein-Code ist gültig 🎉";
            paragraphElement.textContent = "Klicke nun auf den Weiter-Button, um den Kauf unserer PLUS-Version abzuschließen. Bitte gibt beim Kauf die E-Mail Adresse an, mit der du dich in der App registriert hast.";
        
            const discountLinks = {
                10: "https://buy.stripe.com/aEUg054d499VbDi28a",
                20: "https://buy.stripe.com/eVa8xDcJA0Dp22I3cd",
                50: "https://buy.stripe.com/9AQ8xD7pg3PBfTydQQ"
            };
        
            const linkElement = document.createElement("a");
            linkElement.href = discountLinks[data.discount];
            linkElement.textContent = "Weiter";
            linkElement.classList.add("continue-button");
            inputFieldElement.remove();
            submitButtonElement.remove();
            formElement.appendChild(linkElement);
        
        } catch (error) {
            console.error("Error occurred:", error);
            if (error.message === "Invalid code") {
                alert("Es gab ein Problem mit deinem Gutschein-Code. Bitte überprüfe, ob alles korrekt eingegeben wurde und versuche es erneut.");
            } else {
                alert("Es gab ein unerwartetes Problem. Bitte versuche es später erneut.");
            }
            inputField.disabled = false;
            submitButton.disabled = false;
            submitButton.textContent = "Einlösen";
        }
        
    });
});
