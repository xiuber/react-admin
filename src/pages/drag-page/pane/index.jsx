import React from 'react';
import {PageContent} from 'ra-lib';
import './style.less';

export default function Pane(props) {
    const {header, fitHeight, children} = props;
    return (
        <PageContent
            fitHeight={fitHeight}
            otherHeight={8}
            styleName="root"
            style={{width: '100%'}}
        >
            <header>
                {header}
            </header>
            <main>
                {children}
            </main>
        </PageContent>
    );
};
