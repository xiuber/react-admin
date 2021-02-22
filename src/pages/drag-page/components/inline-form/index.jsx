import React from 'react';
import styles from './style.less';

export default function InlineForm(props) {
    const {children, className = [], ...others} = props;
    return (
        <div className={[className, styles.root].join(' ')} {...others}>
            {children}
        </div>
    );
}
