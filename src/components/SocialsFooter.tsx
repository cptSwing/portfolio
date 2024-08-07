const SocialsFooter = () => {
    return (
        <footer className='absolute bottom-44 left-1/2 flex min-h-8 w-1/4 -translate-x-1/2 select-none items-center justify-between gap-2 rounded-full border border-green-950 bg-gray-400 px-3 text-center text-sm text-gray-100/20 hover:bg-gray-300 hover:text-gray-100'>
            <div className='cursor-pointer rounded-full bg-gray-600 px-2 py-1 transition-colors hover:text-white'>Github</div>
            <div className='cursor-pointer rounded-full bg-gray-600 px-2 py-1 transition-colors hover:text-white'>LinkedIn</div>
            <div className='cursor-pointer rounded-full bg-gray-600 px-2 py-1 transition-colors hover:text-white'>Email</div>
            <div className='cursor-pointer rounded-full bg-gray-600 px-2 py-1 transition-colors hover:text-white'>TurboSquid</div>
            <div className='cursor-pointer rounded-full bg-gray-600 px-2 py-1 transition-colors hover:text-white'>CGTrader</div>
        </footer>
    );
};

export default SocialsFooter;
