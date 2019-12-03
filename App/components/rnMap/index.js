import PoiMap from './js/PoiMap';
import MicrosoftMap from './js/MicrosoftMap/MicrosoftMap';

const rnMap = {
  get PoiMap() {return PoiMap},
  get MicrosoftMap() {return MicrosoftMap},
}

module.exports=rnMap;
