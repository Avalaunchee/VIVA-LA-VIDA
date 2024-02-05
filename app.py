from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_meal_plan", methods=["POST"])
def get_meal_plan():
    user_input = request.form.get("userInput")
    food_preferences = request.form.get("foodPreferences")
    api_key = "99572b0c02934a3c8b42c68feb38a4ca"  # Replace with your actual Spoonacular API key

    try:
        # Make a request to Spoonacular API to get meal suggestions
        meal_plan = fetch_meal_plan(api_key, user_input, food_preferences)
        return jsonify({"success": True, "mealPlan": meal_plan})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

def fetch_meal_plan(api_key, user_input, food_preferences):
    api_url = f"https://api.spoonacular.com/mealplanner/generate?apiKey={api_key}&timeFrame=day&targetCalories=2000&diet={food_preferences}&title={user_input}"
    response = requests.get(api_url)
    data = response.json()

    # Parse the response to extract the meal plan or relevant information
    if data and data.get("meals"):
        meal_names = [meal["title"] for meal in data["meals"]]
        return ", ".join(meal_names)
    else:
        raise Exception("No meal plan found")

if __name__ == "__main__":
    app.run(debug=True)