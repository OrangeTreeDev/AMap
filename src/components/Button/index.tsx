
/**
 * 按钮有哪些种类：
 * 1.default
 * 2.primary
 * 3.warning
 * 4.ghost
 
 * 按钮有哪些状态：
 * 1.disable
 * 2.active
 */
import React from 'react';
import classnames from 'classnames';
import TouchFeadback from 'rmc-feedback';
import { SymbolIcon } from '../SymbolIcon';
import './index.css';

export interface ButtonProps {
  className?: string;
  activeClassName?: string;
  border?: boolean;
  icon?: React.ReactElement | string;
  size?: 'large' | 'small';
  inline?: boolean;
  onClick?(): void;
}
export class Button extends React.Component<ButtonProps, any> {
  static defaultProps = {
    size: 'large',
  };

  render() {
    const {
      className,
      activeClassName,
      children,
      border,
      icon,
      size,
      inline,
      ...restProps
    } = this.props;

    const wrapCls = classnames(
      'slx-button',
      className,
      {
        'slx-button-small': size === 'small',
        'slx-button-inline': inline,
        'slx-button-border': border,
        'slx-button-icon': icon,
      }
    );

    const kids = React.Children.map(children, child => {
      if (typeof child === 'string') {
        return <span>{child}</span>
      }
      return child;
    });

    let iconEl;
    if (typeof icon === 'string') {
      iconEl = <SymbolIcon
      className={kids ? 'slx-button-button-icon': ''}
        type={icon}
        size={ size === 'large' ? 'md' : 'xxs' }
      >
      </SymbolIcon>
    } else if (icon) {
      const iconElCls = classnames(icon.props.className, {
        'slx-button-button-icon': kids
      });
      iconEl = React.cloneElement(icon, {
        className: iconElCls,
      });
    }

    return (
      <TouchFeadback activeClassName={activeClassName || 'slx-button-active'}>
        {/* eslint-disable-next-line */}
        <a className={wrapCls} {...restProps}>
          {iconEl}
          {kids}
        </a>
      </TouchFeadback>
    );
  }
}
