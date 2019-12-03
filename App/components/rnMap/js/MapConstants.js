import {Dimensions} from "react-native";
var {height, width} = Dimensions.get('window');

/**
 * Map.js
 */

export default {

    SCREEN_HEIGHT : height,
    SCREEN_WIDTH : width,
    MAP_WIDTH : width,
    MAP_HEIGHT : height,
    ICON_WIDTH : 30,
    ICON_HEIGHT : 30,
    CANCEL : '取消',

    POI: 1,
    SEARCH: 2,
    PAN: 3,
    CLICK: 4,
}
