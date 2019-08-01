import React from 'react';
import { SearchBar, Button } from 'antd-mobile';
import { GroupButtons } from '../../components/GroupButtons';
import './index.css';

export interface MapState {
  isLocating: boolean;
}

const AMap = (window as any).AMap;
let mapObj: any;
let geolocation: any;
export class Map extends React.Component<any, MapState> {
  constructor(props: any) {
    super(props);
    
    this.state = {
      isLocating: false,
    };

    this.handlePositionClick = this.handlePositionClick.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
  }

  componentDidMount() {
    mapObj = new AMap.Map('container', {
      zoom: 17
    });
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
  }

  handlePositionClick() {
    this.setState({ isLocating: true });
    geolocation.getCurrentPosition();
  }

  handleZoomChange(index: number, event: React.SyntheticEvent) {
    if (index === 0) { // 方法
      mapObj.zoomIn();
    } else if (index === 1) {
      mapObj.zoomOut();
    }
  }

  render() {
    return (
      <div className="map">
        <SearchBar className="search" placeholder="查找地点、公交、地铁"></SearchBar>
        <div id="container"></div>
        <Button
          className="locate"
          loading={this.state.isLocating}
          icon="icon-dingwei"
          style={{position: 'absolute', color: '#0091FF'}}
          onClick={this.handlePositionClick}
        >
        </Button>
        <GroupButtons
          className="zoom"
          icons={['icon-hao', 'icon--hao']}
          onChange={this.handleZoomChange}
        >
        </GroupButtons>
      </div>
    );
  }
}