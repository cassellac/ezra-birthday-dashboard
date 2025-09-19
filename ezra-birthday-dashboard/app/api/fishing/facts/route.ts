import { NextResponse } from 'next/server';

export async function GET() {
  const facts = [
    "There are over 32,000 known species of fish in the world!",
    "The oldest known fishing hook is about 42,000 years old.",
    "Some fish can recognize themselves in mirrors, showing self-awareness.",
    "The largest fish ever caught was a great white shark weighing 3,427 pounds.",
    "Fish have been on Earth for more than 500 million years.",
    "Some fish, like the cleaner wrasse, use tools to open shellfish.",
    "The fastest fish is the sailfish, which can swim up to 68 mph.",
    "Many fish can see ultraviolet and polarized light.",
    "The oldest known fishing reel appeared in China around 300 AD.",
    "Some fish, like salmon, can jump up to 12 feet high!"
  ];
  
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  
  return NextResponse.json({ fact: randomFact, allFacts: facts });
}
