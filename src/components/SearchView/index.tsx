import React from 'react';
import { SearchBar, List } from 'antd-mobile';
import { Button } from '../Button';
import './index.css';

export interface SearchViewState {
  isFocus: boolean;
}

export interface SearchViewProps {
  onChange(val: string): void;
  onSelect(val: string): void;
  onSubmit(val: string): void;
  tips: any[],
}

export class SearchView extends React.Component<SearchViewProps, SearchViewState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isFocus: false
    };

    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleListItemClick() {
    // this.props.onSelect(place);
    console.log('click');
  }

  render() {
    const { isFocus } = this.state;
    const { tips, onSelect, ...restProps } = this.props;
    const tipListEl = tips.map((tip, index) => {
      return <List.Item key={index} onClick={this.handleListItemClick}>{tip.name}</List.Item>;
    });
    return (
      <div className="search-view">
        <SearchBar
          className="search-bar"
          placeholder="查找地点、公交、地铁"
          onFocus={() => this.setState({isFocus: true})}
          onBlur={() => this.setState({isFocus: false})}
          {...restProps}
        >
        </SearchBar>
        <div className="search-list" style={{display: isFocus ? 'block' : 'none'}}>
          <List>
            {tipListEl}
          </List>
          <div className="search-list-tools">
            <Button className="search-list-clear">清除全部历史记录</Button>
            <Button className="search-list-fold" icon="up"></Button>
          </div>
        </div>
      </div>
    );
  }
}