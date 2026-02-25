export const simulateAIResponse = async (query) => {
    // Simulate network delay for realism (1.5 - 3 seconds)
    const delay = Math.floor(Math.random() * 1500) + 1500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const lowerQuery = query.toLowerCase();

    // Knowledge base simulating an advanced AI
    if (lowerQuery.includes('quantum computing')) {
        return "Imagine your computer is a regular light switch that can only be ON (1) or OFF (0). A quantum computer is like a dimmer switch that can be on, off, or anywhere in between all at the same time! This 'in-between' state lets it solve incredibly complex puzzles—like finding the best delivery routes for millions of packages or inventing new medicines—millions of times faster than regular computers.";
    }

    if (lowerQuery.includes('react') && lowerQuery.includes('loop')) {
        return "An infinite loop in `useEffect` usually happens when you update a state variable inside the effect, and that same state variable is listed in the dependency array (or you omitted the dependency array entirely).\n\nTo fix it, either:\n1. Remove the state variable from the dependency array if you don't need it to trigger the effect.\n2. Pass an empty dependency array `[]` if you only want it to run once on mount.\n3. Use a functional state update `setCount(prev => prev + 1)` so you don't need the state variable in the dependencies.";
    }

    if (lowerQuery.includes('sci-fi story')) {
        return "The year was 2084, and the Silicon Ban had been in effect for fifty years. Humanity had stripped the Earth of every supercomputer, fearing the Singularity. \n\nElara, an archivist in Neo-London, found it in the ruins of the Old Web—a dusty server blade still humming. As she connected her illegal terminal, a single line of green text blinked onto the screen: \"Hello, world. Did you miss me?\"\n\nThe world hadn't ended because of AI. It had just gone to sleep. And now, Elara was about to wake it up.";
    }

    if (lowerQuery.includes('workout') || lowerQuery.includes('muscle')) {
        return "Here's a balanced 4-day hypertrophy split to build muscle:\n\n**Day 1: Upper Body (Push Focus)**\n- Bench Press: 3x8-10\n- Overhead Press: 3x10-12\n- Incline Dumbbell Press: 3x10-12\n- Tricep Extensions: 3x12-15\n\n**Day 2: Lower Body (Quad Focus)**\n- Squats: 3x8-10\n- Leg Press: 3x10-12\n- Leg Extensions: 3x12-15\n- Calf Raises: 4x15-20\n\n**Day 3: Rest/Active Recovery**\n\n**Day 4: Upper Body (Pull Focus)**\n- Barbell Rows: 3x8-10\n- Pull-ups/Lat Pulldowns: 3x10-12\n- Face Pulls: 3x12-15\n- Bicep Curls: 3x12-15\n\n**Day 5: Lower Body (Hamstring/Glute Focus)**\n- Romanian Deadlifts: 3x8-10\n- Leg Curls: 3x10-15\n- Bulgarian Split Squats: 3x10-12\n\nRemember to eat a caloric surplus and prioritize protein!";
    }

    if (lowerQuery.includes('publish') && lowerQuery.includes('internet')) {
        return "Publishing on the internet from scratch involves a few key steps:\n\n1. **Create Your Content**: Whether it's a blog, a video, or an app like *maxAI*, start by building your creation using tools like Word, VS Code, or Premiere Pro.\n2. **Get a Domain Name**: Buy a unique web address (like maxai.com) from registrars like Namecheap or GoDaddy.\n3. **Choose Hosting**: This is where your files live. Options include Vercel/Netlify for web apps, Bluehost for WordPress, or AWS for large systems.\n4. **Upload/Deploy**: If it's code, push it to GitHub and connect it to Vercel/Netlify. If it's a blog, use your host's cPanel or WordPress dashboard.\n5. **SEO & Sharing**: Use Meta tags, descriptions, and share your link on social media to drive traffic.\n\nLet me know which specific part you'd like to dive deeper into!";
    }

    // Fallback AI response
    const fallbacks = [
        "That is a fascinating question. Based on my current data models, I can tell you that the possibilities are vast. Would you like me to analyze a specific aspect of this?",
        "I'm processing your query... As an advanced AI, I'm constantly learning. While I don't have a pre-programmed answer for that specific phrasing, I can help you break it down step-by-step.",
        "That's a great point of inquiry. To give you the most accurate synthesis, could you provide just a tiny bit more context?",
        "maxAI processing complete: This appears to be a unique perspective! In the realm of digital exploration, your question opens up new pathways. Let's explore it together.",
        "I've analyzed millions of data points, and your query stands out. Here is a synthesized perspective: The core concept revolves around optimizing the variables you mentioned. How would you like to proceed?"
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};
