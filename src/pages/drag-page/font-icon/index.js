import {createFromIconfontCN} from '@ant-design/icons';
import PropTypes from 'prop-types';

const FontIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2363884_6r6pod7x9rk.js',
});

FontIcon.propTypes = {
    type: PropTypes.string.isRequired,
    style: PropTypes.object,
};

/*
* <FontIcon type="icon-kafka"/>
* */

export default FontIcon;
