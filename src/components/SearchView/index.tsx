import React from 'react';
import { SearchBar, List } from 'antd-mobile';
import { Button } from '../Button';
import './index.css';
import { PlaceTip } from '../../declare';

export interface SearchViewProps {
  onChange(val: string): void;
  onSelect(val: PlaceTip): void;
  onClear: () => void;
  onFocus(): void;
  onBlur(): void;
  onSubmit(val: string): void;
  tips: any[];
  isTipShown: boolean;
}

export class SearchView extends React.Component<SearchViewProps, {}> {
  render() {
    const { tips, isTipShown, onSelect, onClear, ...restProps } = this.props;

    const tipListEl = tips.map((tip, index) => {
      return <List.Item key={index} onClick={() => onSelect(tip)}>{tip.name}</List.Item>;
    });

    return (
      <div className="search-view">
        <SearchBar
          className="search-bar"
          placeholder="查找地点、公交、地铁"
          {...restProps}
        >
        </SearchBar>
        <div className="search-list" style={{display: isTipShown ? 'block' : 'none'}}>
          <List>
            {tipListEl}
          </List>
          <div className="search-list-tools">
            <Button className="search-list-clear" onClick={() => onClear()}>清除全部历史记录</Button>
            <Button className="search-list-fold" icon="up"></Button>
          </div>
        </div>
      </div>
    );
  }
}