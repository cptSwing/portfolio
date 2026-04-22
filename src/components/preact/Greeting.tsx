import { useState } from 'preact/hooks';

const Greeting = ({ messages }: { messages: string[] }) => {
    const [greeting, setGreeting] = useState(randomMessage(messages));

    return (
        <div class="flex flex-col items-center justify-start">
            <h3>{greeting}! Thank you for visiting!</h3>
            <button class="rounded-md bg-gray-200 p-1 py-0.5 active:bg-gray-300" onClick={handleGreeting}>
                New Greeting
            </button>
        </div>
    );

    function handleGreeting() {
        setGreeting(randomMessage(messages));
    }
};

export default Greeting;

function randomMessage(messages: string[]) {
    return messages[Math.floor(Math.random() * messages.length)];
}
