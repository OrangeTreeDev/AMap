import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import { Route } from 'react-router-dom';
import { Button } from '../../components/Button';
import { MapContainer } from '../../components/MapContainer';
import './index.css';

/**
//  * 查询字符串对象化
//  * @param str 
//  */
// function parseQueryString(str: string): Dictionary<string> {
//   const segments: string[] = str.slice(1).split('&');
//   const queryObj: Dictionary<string> = segments.reduce((obj: Dictionary<string>, segment: string) => {
//     const keyValArr: string[] = segment.split('=');
//     obj[keyValArr[0]] = keyValArr[1];
//     return obj;
//   }, {});
//   return queryObj;
// }

interface PlaceTip {
  address: string;
  name: string;
  location: { lat: string; lng: string }
}

interface MapViewState {
  placeTip: PlaceTip;
}

export class MapView extends React.Component<{}, MapViewState> {

  constructor(props: any) {
    super(props);

    this.state = {
      placeTip: {
        address: '',
        name: '',
        location: { lat: '', lng: '' }
      },
    };
  }

  componentDidMount() {
    const searchHistoryCache: string | null = sessionStorage.getItem('search_history');
    if (searchHistoryCache) {
      const searchHistory: Array<PlaceTip> = JSON.parse(searchHistoryCache);
      this.setState({
        placeTip: searchHistory[searchHistory.length - 1]
      });
    }
  }

  render() {
    const { placeTip } = this.state;

    const navBar = (
      <Route
        children = {
          ({ history }) => {
            return <NavBar
              mode="light"
              icon={<Icon type="left"></Icon>}
              onLeftClick={() => history.goBack()}
            >
              {placeTip.name}
            </NavBar>
          }
        }
      ></Route>
    );

    const placeDetail = (
      <div className="card">
        <div className="info">
          <div className="name">{placeTip.name}</div>
          <div className="address">{placeTip.address}</div>
        </div>
        <div className="action">
          <Button size="small" icon="icon-fujin1">搜周边</Button>
          <Button size="small" icon="icon-route">去这里</Button>
        </div>
      </div>
    );

    return (
      <div className="search-map-view">
        <MapContainer placeTip={placeTip}  header={navBar} footer={placeDetail}>
        </MapContainer>
      </div>
    );
  }
} 