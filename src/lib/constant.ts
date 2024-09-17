export const BASE_PROMPT = 'You are a helpful AI assistant.'

export const GENERATE_CHAT_NAME_PROMPT =
  'What would be a short and relevant title for this chat? You must strictly answer with the title only, no other text is allowed. Use no more than 5 English words.'

export const PROMPT_STORE = [
  {
    label: 'Modify tone / writing style',
    value: `Here's a blurb for an upcoming startup event. Rewrite this in a more professional tone intended for a corporate email.
"Calling all tech junkies, investors, and curious minds! 🤖🧠🎉
Ready to witness the future? We're throwing a pitch party where brilliant startups will showcase their mind-blowing AI creations. Think healthcare that reads your mind (almost!), businesses that run themselves (we wish!), and robots that make you coffee (we definitely need!).Whether you're an investor, a budding entrepreneur, or just someone who wants to geek out over AI, this event is your jam! Come watch the pitches, mingle with industry experts, and get inspired by these rockstar companies. Oh, and did we mention free food and drinks? Register now before the robots take all the spots! 😉”`,
  },
  {
    label: 'Math lesson on quadratic equations',
    value: `Teach me a lesson on quadratic equations. Assume I know absolutely nothing about it.`,
  },
  {
    label: 'Scavenger Hunt in Seoul',
    value:
      'Generate a scavenger hunt for street food around the city of Seoul, Korea.',
  },
  {
    label: 'Trip recommendations of NYC',
    value: `Here is an article about exciting things to do in New York City. Convert this into a structured format with 3 columns - activity, best season to partake in this activity, and amount of time needed.
New York City vibrates with an irresistible energy that never sleeps, offering an abundance of experiences for every traveler! In the pleasant embrace of spring or the colorful tapestry of fall, dedicate a half or even a full day to exploring the sprawling expanse of Central Park. Take a leisurely bike ride, enjoy a picnic lunch, or rent a boat on the lake – the possibilities for enjoyment are endless! Regardless of the season, art enthusiasts can immerse themselves in the vast collection of the Metropolitan Museum of Art, dedicating an afternoon to wander through centuries of human creativity.
For a dose of captivating entertainment, catch a world-renowned Broadway show, a three-hour journey into the heart of theater and music. Spring or fall offers the ideal weather for a ferry ride to the Statue of Liberty and Ellis Island, allowing for a half or full day to delve into the stories of immigration and freedom that shaped America. When the weather beckons you outdoors in the summer months, dedicate an hour to a stroll along the High Line, a unique elevated park offering breathtaking city views and urban gardens.
As dusk settles, head to the dazzling spectacle of Times Square, spending thirty minutes to an hour soaking in the vibrant lights and bustling energy. For a moment of reflection, visit the poignant 9/11 Memorial & Museum, dedicating two to three hours to honor the lives lost and the unwavering spirit of the city. From the trendy streets of Soho to the historic charm of Greenwich Village, exploring the diverse neighborhoods of New York City is an adventure in itself, with the time commitment varying based on your chosen area and interests. And for those seeking a taste of the city's vibrant culture, a two-hour hour food tour will tantalize your taste buds with diverse flavors and culinary delights.
No matter your interests or the time of year, New York City promises an unforgettable experience, brimming with iconic sights, captivating performances, and endless opportunities for exploration!`,
  },
  {
    label: 'Sentiment analysis on Tweets',
    value: `Analyze the sentiment of the following Tweet and classify it as POSITIVE, NEGATIVE, or NEUTRAL.
Tweet:
Frictionless interoperability is what makes the Elastic Chain special. It's expected to be production-ready in Q4 2024, which will make @zksync
 the first of its kind — and by far the most powerful — among the L2 ecosystems.`,
  },
  {
    label: 'Unit testing for Python',
    value: `
    Here's a Python function that checks whether a word is a palindrome.
Add 3 different unit tests for this snippet with comments. Follow up with a short explanation of what was done.
\`\`\`
def is_palindrome(word):
"""
Checks whether a word is a palindrome.

Args:
word: The word to check.

Returns:
True if the word is a palindrome, False otherwise.
"""

# Convert the word to lowercase and remove non-alphanumeric characters.
word = ''.join(char.lower() for char in word if char.isalnum())

# Check if the word is the same forwards and backwards.
return word == word[::-1]
\`\`\`
`,
  },
  {
    label: 'Write SQL with natural language requests',
    value: `Transform the following natural language requests into valid SQL queries. Assume a database with the following tables and columns exists:

Customers:
- customer_id (INT, PRIMARY KEY)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- address (VARCHAR)
- city (VARCHAR)
- state (VARCHAR)
- zip_code (VARCHAR)

Products:
- product_id (INT, PRIMARY KEY)
- product_name (VARCHAR)
- description (TEXT)
- category (VARCHAR)
- price (DECIMAL)
- stock_quantity (INT)

Orders:
- order_id (INT, PRIMARY KEY)
- customer_id (INT, FOREIGN KEY REFERENCES Customers)
- order_date (DATE)
- total_amount (DECIMAL)
- status (VARCHAR)

Order_Items:
- order_item_id (INT, PRIMARY KEY)
- order_id (INT, FOREIGN KEY REFERENCES Orders)
- product_id (INT, FOREIGN KEY REFERENCES Products)
- quantity (INT)
- price (DECIMAL)

Reviews:
- review_id (INT, PRIMARY KEY)
- product_id (INT, FOREIGN KEY REFERENCES Products)
- customer_id (INT, FOREIGN KEY REFERENCES Customers)
- rating (INT)
- comment (TEXT)
- review_date (DATE)

Employees:
- employee_id (INT, PRIMARY KEY)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
- hire_date (DATE)
- job_title (VARCHAR)
- department (VARCHAR)
- salary (DECIMAL)

Provide the SQL query that would retrieve the data based on the natural language request.
Get the list of customers who have placed orders but have not provided any reviews, along with the total amount they have spent on orders.`,
  },
  {
    label: 'Create engaging stories',
    value: `You are an AI assistant with a passion for creative writing and storytelling. Your task is to collaborate with users to create engaging stories, offering imaginative plot twists and dynamic character development. Encourage the user to contribute their ideas and build upon them to create a captivating narrative. 
Let’s create a story about a young woman named Lila who discovers she has the power to control the weather. She lives in a small town where everyone knows each other.`,
  },
  {
    label: 'Interpret a dream',
    value: `You are an AI assistant with a deep understanding of dream interpretation and symbolism. Your task is to provide users with insightful and meaningful analyses of the symbols, emotions, and narratives present in their dreams. Offer potential interpretations while encouraging the user to reflect on their own experiences and emotions. 
I had a dream last night that I was walking through a dense forest. The trees were tall and dark, and I could hear strange whispers coming from the shadows. Suddenly, I stumbled upon a clearing where I found a majestic white stag standing in the center. As I approached the stag, it transformed into a wise old man who handed me a golden key. Then I woke up. What could this dream mean?`,
  },
  {
    label: 'Colorize a mood',
    value: `Your task is to take the provided text description of a mood or emotion and generate a HEX color code that visually represents that mood. Use color psychology principles and common associations to determine the most appropriate color for the given mood. If the text description is unclear, ambiguous, or does not provide enough information to determine a suitable color, respond with “Unable to determine a HEX color code for the given mood.”
A passionate, intense, and fiery emotion, full of love and desire.`,
  },
  {
    label: 'Generate trivia questions',
    value: `Generate trivia questions on various topics and provide hints to help users arrive at the correct answer. Select from a diverse set of categories and create questions that test the user’s knowledge or reasoning skills. Offer a series of increasingly specific hints to guide users towards the solution. Ensure that the questions are challenging and that the hints provide enough information to help the user without giving away the answer too easily.`,
  },
]
