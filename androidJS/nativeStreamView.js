/**
 * Created by yuanyuanzhao on 2017/7/19.
 */
import PropTypes from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

var iface = {
    name: 'ZYLiveBackGroundView',
    propTypes: {
        src: PropTypes.string,
        ...View.propTypes // include the default view properties
    },
};

module.exports = requireNativeComponent('ZYLiveBackGroundGroupViewManager',iface);