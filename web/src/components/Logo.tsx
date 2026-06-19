import React from 'react';

const Logo: React.FC = () => {
 
    const isBrowser = !window.invokeNative;

    const logoSrc = isBrowser 
        ? './img/logo.png' 
        : 'nui://krs_hud/web/img/logo.png';

    return (
        <div style={styles.container}>
            <img 
                src={logoSrc} 
                alt="Destiny RP Logo" 
                style={styles.image} 
                onError={(e) => {
                    e.currentTarget.src = './img/logo.png';
                }}
            />
        </div>
    );
};

const styles = {
    container: {
        position: 'absolute' as 'absolute',
        top: '20px',   
        right: '20px', 
        zIndex: 50,   
    },
    image: {
        width: '120px', 
        height: 'auto',
        opacity: 0.9,   
    }
};

export default Logo;