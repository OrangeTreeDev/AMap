import * as React from 'react';
import classnames from 'classnames';
import TouchFeedback from 'rmc-feedback';
import { SymbolIcon } from '../SymbolIcon';
import './index.css';

export interface GroupButtonsProps {
  className?: string;
  activeClassName?: string;
  icons: string[];
  size?: 'md' | 'lg';
  iconColor?: string;
  onChange?: (index: number, event: React.SyntheticEvent) => void,
};

export class GroupButtons extends React.Component<GroupButtonsProps, {}> {
  static defaultProps = {
    size: 'md',
  };

  handleClick(index: number, event: React.SyntheticEvent) {
    const { onChange } = this.props;
    onChange && onChange(index, event);
  }

  render() {
    const {
      className,
      activeClassName,
      icons,
      size,
    } = this.props;

    const buttonsEl = icons.map((icon, index) => {
      const buttonElCls = classnames('group-button', `group-button-${size}`);
      const buttonEl = (
        <TouchFeedback key={icon} activeClassName={ activeClassName || 'group-button-active'}>
          {/* eslint-disable-next-line */}
          <a role="button" className={buttonElCls} onClick={e => this.handleClick(index, e)}>
              <SymbolIcon type={icon} size={size}></SymbolIcon>
          </a>
        </TouchFeedback>
      );
      return buttonEl;
    });

    const groupButtonsCls = classnames(
      'group-buttons',
      `group-buttons-${size}`,
      className
    );

    return (
      <div className={groupButtonsCls}>
        {buttonsEl}
      </div>
    );
  }
}