const Footer = () => {
    return (
        <footer className="fixed bottom-0 mx-auto h-[3svh] min-h-8 w-1/3 min-w-48">
            <nav className="flex size-full select-none items-start justify-evenly">
                <div className="cursor-pointer bg-green-900 px-2 py-1">Resumé</div>
                <div className="cursor-pointer bg-green-900 px-2 py-1">Code</div>
                <div className="cursor-pointer bg-green-900 px-2 py-1">3D Art</div>
                <div className="cursor-pointer bg-green-900 px-2 py-1">Menu</div>
                <div className="cursor-pointer bg-green-900 px-2 py-1">Back</div>
                <div className="cursor-pointer bg-green-900 px-2 py-1">Forward</div>
                <div className="cursor-pointer bg-green-900 px-2 py-1">Settings</div>
            </nav>
        </footer>
    );
};

export default Footer;
