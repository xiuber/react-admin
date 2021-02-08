import {createFromIconfontCN} from '@ant-design/icons';
import PropTypes from 'prop-types';

const FontIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2363884_z1xbrjz30x.js',
});

FontIcon.propTypes = {
    type: PropTypes.string.isRequired,
    style: PropTypes.object,
};

/*
* <FontIcon type="icon-kafka"/>
* */

export default FontIcon;
