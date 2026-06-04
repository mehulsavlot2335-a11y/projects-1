// Function to calculate age
function calculateAge() {

    // Get input field value
    let birthDate = document.getElementById("birthDate").value;

    // Result div
    let result = document.getElementById("result");

    // Check if input is empty
    if (birthDate === "") {

        // Show message
        result.innerHTML = "Please select your birth date.";

        // Stop function
        return;
    }

    // Convert input date into Date object
    let birth = new Date(birthDate);

    // Current date
    let today = new Date();

    // Check future date validation
    if (birth > today) {

        // Error message
        result.innerHTML = "Future dates are not allowed.";

        // Stop function
        return;
    }

    // Get years difference
    let years = today.getFullYear() - birth.getFullYear();

    // Get months difference
    let months = today.getMonth() - birth.getMonth();

    // Get days difference
    let days = today.getDate() - birth.getDate();

    // If days become negative
    if (days < 0) {

        // Reduce month by 1
        months--;

        // Get previous month's total days
        let previousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        ).getDate();

        // Add previous month days
        days += previousMonth;
    }

    // If months become negative
    if (months < 0) {

        // Reduce year by 1
        years--;

        // Add 12 months
        months += 12;
    }

    // Display result
    result.innerHTML =
        years + " Years, " +
        months + " Months, " +
        days + " Days";
}