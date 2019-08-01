import React from 'react'
import classnames from 'classnames';
import './index.css';

export interface SymbolIconProps {
  className?: string;
  type: string;
  size?: 'md' | 'lg';
  color?: string;
};

export class SymbolIcon extends React.Component<SymbolIconProps, any> {
  static defaultProps = {
    size: 'md',
  };

  render() {
    const { type, size, className, ...restProps } = this.props;
    const cls = classnames('icon', className, `icon-${size}`);
    return (
      <svg className={cls} aria-hidden="true" {...restProps}>
        <use xlinkHref={`#${type}`}></use>
      </svg>
    );
  }
}
