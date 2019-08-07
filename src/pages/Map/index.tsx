import React from 'react';
import { Button } from 'antd-mobile';
import { GroupButtons } from '../../components/GroupButtons';
import { SearchView } from '../../components/SearchView';
import './index.css';

export interface MapState {
  isLocating: boolean; // 正在定位
  hasTraffic: boolean; // 显示路况
  hasSatellite: boolean; // 显示卫星图
  tips: any[]; // 搜索提示
}

const AMap = (window as any).AMap;
let mapObj: any;
let geolocation: any;
let roadNetLayer: any;
let satelliteLayer: any;
export class Map extends React.Component<any, MapState> {
  private autoComplete: any;
  private placeSearch: any;

  constructor(props: any) {
    super(props);
    
    this.state = {
      isLocating: false,
      hasTraffic: false,
      hasSatellite: false,
      tips: [],
    };

    this.handlePositionClick = this.handlePositionClick.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.handleTrafficClick = this.handleTrafficClick.bind(this);
    this.handleSatelliteClick = this.handleSatelliteClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePlaceSearch = this.handlePlaceSearch.bind(this);
  }

  componentDidMount() {
    mapObj = new AMap.Map('container', {
      level: 17
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
      AMap.event.addListener(geolocation, 'complete', () => this.setState({ isLocating: false }));
      AMap.event.addListener(geolocation, 'complete', () => this.setState({ isLocating: false }));
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
   * 定位按钮点击事件处理
   */
  handlePositionClick() {
    this.setState({ isLocating: true });
    geolocation.getCurrentPosition();
  }

  /**
   * 缩放改变事件处理
   * @param index 按钮位置
   * @param event 事件对象
   */
  handleZoomChange(index: number, event: React.SyntheticEvent) {
    if (index === 0) { // 放大
      mapObj.zoomIn();
    } else if (index === 1) { // 缩小
      mapObj.zoomOut();
    }
  }

  /**
   * 开关路况事件处理
   */
  handleTrafficClick() {
    if (!roadNetLayer) {
      roadNetLayer = new AMap.TileLayer.Traffic({
        map: mapObj,
      });
    }
    if (!this.state.hasTraffic) {
      roadNetLayer.show();
    } else {
      roadNetLayer.hide();
    }
    this.setState(state => ({ hasTraffic: !state.hasTraffic }));
  }

  handleSatelliteClick() {
    if (!satelliteLayer) {
      satelliteLayer = new AMap.TileLayer.Satellite({
        map: mapObj,
      });
    }
    if (!this.state.hasSatellite) {
      satelliteLayer.show();
    } else {
      satelliteLayer.hide();
    }
    this.setState(state => ({ hasSatellite: !state.hasSatellite }));
  }

  /**
   * 搜索框内容改变事件处理
   * @param keyword 搜索关键字
   */
  handleSearchChange(keyword: string) {
    this.autoComplete.search(keyword, (status: string, result: any) => {
      this.setState({
        tips: status === 'complete' ? result.tips : []
      });
    });
  }

  /**
   * 点击搜索提示处理
   * @param place 
   */
  handlePlaceSearch(place: string) {
    this.placeSearch.search(place, (status: string, result: any) => {
      console.log(result);
    });
  }

  render() {
    return (
      <div className="map">
        <SearchView
          onChange={this.handleSearchChange}
          onSelect={this.handlePlaceSearch}
          onSubmit={this.handlePlaceSearch}
          tips={this.state.tips}
        >
        </SearchView>
        <div id="container"></div>
        <Button
          className="button locate"
          loading={this.state.isLocating}
          icon="icon-dingwei"
          style={{position: 'absolute', color: '#0091FF'}}
          onClick={this.handlePositionClick}
        >
        </Button>
        <Button
          className="button traffic"
          icon={this.state.hasTraffic ? 'icon-lukuang_select' : 'icon-lukuang'}
          style={{position: 'absolute'}}
          onClick={this.handleTrafficClick}
        >
        </Button>
        <Button
          className="button satellite"
          icon={this.state.hasSatellite ? 'icon-weixing' : 'icon-tuceng'}
          style={{position: 'absolute'}}
          onClick={this.handleSatelliteClick}
        >
        </Button>
        <GroupButtons
          className="zoom"
          icons={['plus', 'minus']}
          onChange={this.handleZoomChange}
        >
        </GroupButtons>
      </div>
    );
  }
}