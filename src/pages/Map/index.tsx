import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Modal } from 'antd-mobile';
import { MapContainer } from '../../components/MapContainer';
import { SearchView } from '../../components/SearchView';
import { PlaceTip } from '../../declare';
import './index.css';

interface MapState {
  tips: any[]; // 搜索提示
  isTipShown: boolean;
}

const AMap = (window as any).AMap;
const SEARCH_HISTORY_ITEM = 'search_history';
let mapObj: any;
let geolocation: any;
export class Map extends React.Component<RouteComponentProps<any>, MapState> {
  private autoComplete: any;
  private blurTimer: any;
  private placeSearch: any;

  constructor(props: any) {
    super(props);
    
    this.state = {
      tips: this.getSearchHistory().reverse(),
      isTipShown: false
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchSelect = this.handleSearchSelect.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleSearchFocus = this.handleSearchFocus.bind(this);
    this.handleSearchBlur = this.handleSearchBlur.bind(this);
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

  componentWillUnmount() {

  }

  getSearchHistory(): Array<PlaceTip> {
    const searchHistoryCache: string | null = sessionStorage.getItem(SEARCH_HISTORY_ITEM);
    return searchHistoryCache ? JSON.parse(searchHistoryCache) : [];
  }

  /**
   * 搜索框内容改变事件处理
   * @param keyword 搜索关键字
   */
  handleSearchChange(keyword: string) {
    if(keyword) {
      this.autoComplete.search(keyword, (status: string, result: any) => {
        this.setState({
          tips: status === 'complete' ? result.tips.slice(0, 10) : []
        });
      });
    } else {
      this.setState({
        tips: this.getSearchHistory().reverse()
      });
    }
  }

  /**
   * 点击搜索提示处理
   * @param place 
   */
  handleSearchSelect(placeTip: PlaceTip) {
    // 删除相同名称的搜索提示，添加新增的搜索提示
    let searchHistory: Array<PlaceTip> = this.getSearchHistory();
    const index: number = searchHistory.findIndex((item) => item.name === placeTip.name);
    if(index !== -1) {
      searchHistory.splice(index, 1);
    }
    searchHistory.push(placeTip);
    // 缓存已选的搜索提示到搜索记录中
    sessionStorage.setItem(SEARCH_HISTORY_ITEM, JSON.stringify(searchHistory));
    // 跳转到位置详情页
    this.props.history.push(`/search/mapview?keywords=${placeTip.name}`);
  }

  /**
   * 清除按钮点击处理
   */
  handleClearClick() {
    this.setState({
      isTipShown: true
    });
    Modal.alert('', '清空历史记录', [
      {text: '取消', onPress: undefined},
      {
        text: '清空',
        onPress: () => {
          sessionStorage.removeItem(SEARCH_HISTORY_ITEM);
          this.setState({
            tips: []
          });
        }
      },
    ]);
  }

  /**
   * 搜索输入框聚焦处理
   */
  handleSearchFocus() {
    this.setState({
      isTipShown: true
    });
  }

  /**
   * 搜索输入框失去焦点处理
   */
  handleSearchBlur() {
    this.blurTimer = setTimeout(() => {
      this.setState({
        isTipShown: false
      });
    }, 100);
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
        onFocus={this.handleSearchFocus}
        onBlur={this.handleSearchBlur}
        onClear={this.handleClearClick}
        tips={this.state.tips}
        isTipShown={this.state.isTipShown}
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