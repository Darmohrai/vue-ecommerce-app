const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-8">
            <div className="container mx-auto px-4 text-center">

                <p className="mb-3 text-sm">
                    &copy; {new Date().getFullYear()} FakeStore E-Commerce Application. All rights reserved.
                </p>

                <div className="text-xs text-gray-400">
                    {/* Вимога до Футера: ПІБ, група, посилання на GitHub */}
                    <p className="font-semibold mb-1">Розроблено (Team Course Project):</p>
                    <p>
                        [Ваше ПІБ], Група [Ваш №] |
                        <a
                            href="[Ваше посилання на GitHub]"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 ml-1"
                        >
                            GitHub Profile
                        </a>
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;