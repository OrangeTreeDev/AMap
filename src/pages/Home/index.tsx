import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Icon } from 'antd-mobile';
import './index.css';

interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  routes?: RouteConfig[];
}

interface HomeProps {
  routes: RouteConfig[];
}

interface TabItemLinkProps {
  icon: string;
  title: string;
  to: string;
}

// /**
//  * 导航tab组件
//  * @param param0 
//  */
// function TabItemLink({icon, title, to}: TabItemLinkProps) {
//   return (
//     <Route
//       exact
//       path={to}
//       children={({ match }) => {
//         const cls = classnames('tab-link', {'tab-link-selected': match});
//         return (
//           <Link className={cls} to={to}>
//             <Icon type={icon} size="md"></Icon>
//             <span>{title}</span>
//           </Link>
//         );
//       }}
//     ></Route>
//   );
// }

const tabBarParams = [
  { icon: 'icon-ditu', title: '地图', to: '/home/map'},
  { icon: 'icon-route', title: '路径', to: '/home/routePlan'},
  { icon: 'icon-fujin1', title: '附近', to: '/home/neighborhood'}
];
export class Home extends React.Component<HomeProps, any> {
  render() {
    const {
      routes
    } = this.props;

    return (
      <div>
        <div className="tab-bar">
          {
            // tabBarParams.map(item => <TabItemLink key={item.to} {...item}></TabItemLink>)
            tabBarParams.map(item => {
              return (<NavLink
                key={item.to}
                to={item.to}
                className="tab-link"
                activeClassName="tab-link-selected"
                exact>
                  <Icon type={item.icon} size="md"></Icon>
                  <span>{item.title}</span>
                 </NavLink>
              );
            })
          }
        </div>
        {
          routes.map((route, index) => <Route key={index} path={route.path} component={route.component}></Route>)
        }
      </div>
    );
  }
}