export const truthQuestions = [
  "What's the most embarrassing thing you've ever done?",
  "Who was your first crush?",
  "What's a secret you've never told anyone?",
  "What's the biggest lie you've ever told?",
  "Have you ever cheated on a test?",
  "What's your biggest fear?",
  "What's the worst date you've ever been on?",
  "Have you ever had a crush on a friend's partner?",
  "What's something you're glad your parents don't know about you?",
  "What's the most childish thing you still do?",
  "What's a habit you have that you hate?",
  "Who in this room would you most want to switch lives with?",
  "What's the most expensive thing you've ever broken?",
  "Have you ever been caught in a lie?",
  "What's your biggest insecurity?",
  "What's the most trouble you've ever been in?",
  "Have you ever stolen anything?",
  "What's your most embarrassing guilty pleasure?",
  "What's the weirdest dream you've ever had?",
  "If you could change one thing about yourself, what would it be?",
  "What's the most awkward situation you've been in?",
  "Have you ever ghosted someone?",
  "What's a talent you wish you had?",
  "What's the worst thing you've said about someone behind their back?",
  "Have you ever regretted something you said in the heat of the moment?",
  "What's the longest you've gone without showering?",
  "What's your most unpopular opinion?",
  "Have you ever laughed at someone else's misfortune?",
  "What's the meanest thing you've ever done to someone?",
  "What's something you've done that you're ashamed of?"
];

export const dareQuestions = [
  "Do 20 pushups right now!",
  "Send a silly selfie to a random contact in your phone.",
  "Speak in an accent for the next 3 rounds.",
  "Let the other player post anything they want on your social media.",
  "Dance with no music for 1 minute.",
  "Eat a spoonful of a condiment of the other player's choice.",
  "Call a friend and sing 'Happy Birthday' even if it's not their birthday.",
  "Do your best impression of the other player.",
  "Speak in rhymes for the next 5 minutes.",
  "Let the other player draw on your face with a marker.",
  "Do 50 jumping jacks.",
  "Imitate a celebrity until the other player can guess who it is.",
  "Wear your clothes backward for the rest of the game.",
  "Talk without closing your mouth.",
  "Act like your favorite animal until your next turn.",
  "Sing everything you say for the next 10 minutes.",
  "Do the worm dance move.",
  "Pretend to be a robot for the next 3 rounds.",
  "Let the other player give you a new hairstyle.",
  "Eat a raw onion slice.",
  "Do your best evil villain laugh.",
  "Plank for 2 minutes.",
  "Talk in a baby voice until your next turn.",
  "Do 10 cartwheels in a row.",
  "Moonwalk across the room.",
  "Act out a dramatic scene from a movie.",
  "Eat a spoonful of hot sauce.",
  "Balance a book on your head for 3 minutes.",
  "Do a trust fall with a piece of furniture.",
  "Freestyle rap about the other player for 30 seconds."
];

export function getRandomTruth(): string {
  return truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
}

export function getRandomDare(): string {
  return dareQuestions[Math.floor(Math.random() * dareQuestions.length)];
}
