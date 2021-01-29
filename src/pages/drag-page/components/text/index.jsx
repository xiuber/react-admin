import React from 'react';

export default function Text(props) {
    const {text, ...others} = props;
    return (
        <sapn {...others}>
            {text}
        </sapn>
    );
};

