const apiKey = '99572b0c02934a3c8b42c68feb38a4ca'; // Replace with your actual Spoonacular API key

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const outputDiv = document.getElementById("output");
    const sendButton = document.querySelector("button");

    // Disable the button during the API request
    sendButton.disabled = true;

    try {
        // Make a request to Spoonacular API to get meal suggestions
        const mealPlan = await getMealPlan(userInput);

        // Display user message and meal plan
        outputDiv.innerHTML += `<p>User: ${userInput}</p>`;
        outputDiv.innerHTML += `<p>Chatbot: Here is your meal plan - ${mealPlan}</p>`;
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        outputDiv.innerHTML += "<p>Chatbot: Oops! Something went wrong. Please try again.</p>";
    } finally {
        // Enable the button after the API request completes (whether successful or not)
        sendButton.disabled = false;

        // Clear user input
        document.getElementById("user-input").value = "";

        // Scroll to the bottom of the chat window
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
}

async function getMealPlan(userPreferences) {
    // Make a request to Spoonacular API to get meal suggestions
    const veganPreference = userPreferences.toLowerCase() === 'vegan' ? 'vegan' : 'vegetarian';
    const apiUrl = `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=2000&diet=${veganPreference}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Parse the response to extract the meal plan or relevant information
    if (data && data.meals && data.meals.length > 0) {
        const mealNames = data.meals.map(meal => meal.title);
        return mealNames.join(", ");
    } else {
        throw new Error("No meal plan found");
    }
}