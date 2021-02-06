import React from 'react';
import classNames from 'classnames';
import styles from './style.less';

export default function PageContent(props) {
    const {className, ...others} = props;

    const cls = classNames(styles.root, className);

    return (
        <div className={cls} {...others}/>
    );
};
