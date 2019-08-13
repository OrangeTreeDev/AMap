import React from 'react';
import { MapContainer } from '../../components/MapContainer';
import { SearchView } from '../../components/SearchView';
import './index.css';
import { RouteComponentProps } from 'react-router';

interface MapState {
  tips: any[]; // 搜索提示
}

const AMap = (window as any).AMap;
let mapObj: any;
let geolocation: any;
export class Map extends React.Component<RouteComponentProps<any>, MapState> {
  private autoComplete: any;
  private placeSearch: any;

  constructor(props: any) {
    super(props);
    
    this.state = {
      tips: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSelect = this.handleSearchSelect.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  componentDidMount() {
    mapObj = new AMap.Map('container', {
      level: 17,
      dragEnable: true,
    });
    // 定位插件
    mapObj.plugin('AMap.Geolocation', () => {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        showButton: false,        //显示定位按钮，默认：true
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
      });
      mapObj.addControl(geolocation);
      geolocation.getCurrentPosition();
    });
    
    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
      // 输入提示插件
      this.autoComplete = new AMap.Autocomplete({
        city: '上海'
      });
      // POI搜索插件
      this.placeSearch = new AMap.PlaceSearch({
        city: '上海'
      });
    });
  }

  /**
   * 搜索框内容改变事件处理
   * @param keyword 搜索关键字
   */
  handleSearchChange(keyword: string) {
    this.autoComplete.search(keyword, (status: string, result: any) => {
      console.log(result);
      this.setState({
        tips: status === 'complete' ? result.tips.slice(0, 10) : []
      });
    });
  }

  /**
   * 点击搜索提示处理
   * @param place 
   */
  handleSearchSelect(place: any) {
    sessionStorage.setItem('place_search', JSON.stringify(place));
    this.props.history.push(`/search/mapview?keywords=${place.name}`);
  }
  
  /**
   * 搜索提交处理
   * @param place 
   */
  handleSearchSubmit(place: string) {
  }

  render() {
    const searchView = (
      <SearchView
        onChange={this.handleSearchChange}
        onSelect={this.handleSearchSelect}
        onSubmit={this.handleSearchSubmit}
        tips={this.state.tips}
      >
      </SearchView>
    );

    return (
      <div className="map">
        <MapContainer header={searchView}>
        </MapContainer>
      </div>
    );
  }
}