const Header = () => {
    return (
        <header className="fixed top-0 z-50 mx-auto h-[12.5%] w-full">
            <nav className="relative flex size-full items-end justify-evenly">
                <div className="flex select-none items-end justify-between gap-1 text-green-200">
                    <div className="min-w-16 cursor-pointer rounded-tr-md border border-b border-green-950 bg-green-1000 px-2 text-center transition-transform hover:text-white active:translate-x-4 active:border-b-0">
                        Updates
                    </div>
                    <div className="min-w-16 cursor-pointer rounded-tr-md border border-b border-green-950 bg-green-1000 px-2 text-center transition-transform hover:text-white active:ml-4 active:translate-x-4 active:border-b-0">
                        Contact / Impressum
                    </div>
                </div>

                <div className="my-auto ml-auto overflow-hidden">
                    <SocialLinks />
                </div>
            </nav>
        </header>
    );
};

export default Header;

const SocialLinks = () => {
    return (
        <div className="bg-green-1000 flex min-h-8 translate-x-1/2 select-none items-center justify-between gap-2 rounded-l-full border border-r-0 border-green-950 pl-3 pr-2 text-center text-sm text-green-200/20 transition-all delay-500 hover:translate-x-0 hover:bg-gray-700 hover:text-green-200">
            <div className="cursor-pointer transition-colors hover:text-white">Github</div>
            <div className="cursor-pointer transition-colors hover:text-white">LinkedIn</div>
            <div className="cursor-pointer transition-colors hover:text-white">Email</div>
            <div className="cursor-pointer transition-colors hover:text-white">TurboSquid</div>
            <div className="cursor-pointer transition-colors hover:text-white">CGTrader</div>
        </div>
    );
};