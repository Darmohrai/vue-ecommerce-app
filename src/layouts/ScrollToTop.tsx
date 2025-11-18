import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Цей компонент закриває вимогу Scroll Behavior
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;