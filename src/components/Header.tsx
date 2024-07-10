const Header = () => {
    return (
        <header className="flex h-40 w-full items-end justify-start">
            <div className="mx-1 w-16 rounded-t-md border text-center">Resumé</div>
            <div className="mx-1 w-16 rounded-t-md border text-center">Code</div>
            <div className="mx-1 w-16 rounded-t-md border text-center">3D Art</div>

            <div className="ml-auto">
                <SocialLinks />
            </div>
        </header>
    );
};

export default Header;

const SocialLinks = () => {
    return (
        <div className="flex border border-r-0">
            <div className="mx-1 text-center text-sm">Github</div>
            <div className="mx-1 text-center text-sm">LinkedIn</div>
            <div className="mx-1 text-center text-sm">Email</div>
            <div className="mx-1 text-center text-sm">TurboSquid</div>
            <div className="mx-1 text-center text-sm">CGTrader</div>
        </div>
    );
};
