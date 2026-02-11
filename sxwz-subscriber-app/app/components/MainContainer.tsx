import * as React from 'react';

const MainContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex-auto">
            {children}
        </div>
    );
}

export default MainContainer;