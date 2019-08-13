import React from 'react';
import { Button } from 'antd-mobile';
import { GroupButtons } from '../../components/GroupButtons';
import './index.css';

interface PlaceTip {
  address: string;
  name: string;
  location: { lat: string; lng: string }
}

interface MapContainerProps {
  header: React.ReactNode;
  footer?: React.ReactNode;
  placeTip?: PlaceTip;
}

interface MapContainerState {
  isLocating: boolean; // 正在定位
  hasTraffic: boolean; // 显示路况
  hasSatellite: boolean; // 显示卫星图
}

const AMap = (window as any).AMap;

export class MapContainer extends React.Component<MapContainerProps, MapContainerState> {
  private mapObj: any;
  private geolocation: any;
  private roadNetLayer: any;
  private satelliteLayer: any;

  constructor(props: any) {
    super(props);
    
    this.state = {
      isLocating: false,
      hasTraffic: false,
      hasSatellite: false,
     
    };

    this.handlePositionClick = this.handlePositionClick.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.handleTrafficClick = this.handleTrafficClick.bind(this);
    this.handleSatelliteClick = this.handleSatelliteClick.bind(this);
  }

  componentDidMount() {
    this.mapObj = new AMap.Map('map', {
      level: 17,
      dragEnable: true,
    });

    // 定位插件
    this.mapObj.plugin('AMap.Geolocation', () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        showButton: false,        //显示定位按钮，默认：true
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
      });
      this.mapObj.addControl(this.geolocation);
      this.geolocation.getCurrentPosition();
      AMap.event.addListener(this.geolocation, 'complete', () => this.setState({ isLocating: false }));
    });
  }

  componentDidUpdate() {
    // 位置点标志
    if (this.props.placeTip && this.props.placeTip.location.lng) {
      const lngLat = new AMap.LngLat(this.props.placeTip.location.lng, this.props.placeTip.location.lat);
      const maker = new AMap.Marker({
          position: lngLat,
      });
      this.mapObj.add(maker);
      this.mapObj.setCenter(lngLat);
    }
  }

    /**
   * 定位按钮点击事件处理
   */
  handlePositionClick() {
    this.setState({ isLocating: true });
    this.geolocation.getCurrentPosition();
  }

  /**
   * 缩放改变事件处理
   * @param index 按钮位置
   * @param event 事件对象
   */
  handleZoomChange(index: number, event: React.SyntheticEvent) {
    if (index === 0) { // 放大
      this.mapObj.zoomIn();
    } else if (index === 1) { // 缩小
      this.mapObj.zoomOut();
    }
  }

  /**
   * 开关路况事件处理
   */
  handleTrafficClick() {
    if (!this.roadNetLayer) {
      this.roadNetLayer = new AMap.TileLayer.Traffic({
        map: this.mapObj,
      });
    }
    if (!this.state.hasTraffic) {
      this.roadNetLayer.show();
    } else {
      this.roadNetLayer.hide();
    }
    this.setState(state => ({ hasTraffic: !state.hasTraffic }));
  }

  /**
   * 开关卫星图像事件处理
   */
  handleSatelliteClick() {
    if (!this.satelliteLayer) {
      this.satelliteLayer = new AMap.TileLayer.Satellite({
        map: this.mapObj,
      });
    }
    if (!this.state.hasSatellite) {
      this.satelliteLayer.show();
    } else {
      this.satelliteLayer.hide();
    }
    this.setState(state => ({ hasSatellite: !state.hasSatellite }));
  }

  render() {
    return (
      <div className="map-container">
        {this.props.header}
        <div id="map"></div>
        <Button
          className="button locate"
          loading={this.state.isLocating}
          icon="icon-dingwei"
          style={{position: 'absolute', color: '#0091FF', bottom: this.props.footer ? '145px' : '30px'}}
          onClick={this.handlePositionClick}
        >
        </Button>
        <Button
          className="button traffic"
          icon={this.state.hasTraffic ? 'icon-lukuang_select' : 'icon-lukuang'}
          style={{position: 'absolute', top: this.props.footer ? '50px' : '90px'}}
          onClick={this.handleTrafficClick}
        >
        </Button>
        <Button
          className="button satellite"
          icon={this.state.hasSatellite ? 'icon-weixing' : 'icon-tuceng'}
          style={{position: 'absolute', top: this.props.footer ? '95px' : '135px'}}
          onClick={this.handleSatelliteClick}
        >
        </Button>
        <GroupButtons
          className="zoom"
          style={{bottom: this.props.footer ? '145px' : '30px'}}
          icons={['plus', 'minus']}
          onChange={this.handleZoomChange}
        >
        </GroupButtons>
        { this.props.footer }
      </div>
    );
  }
}