import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Map } from './pages/Map';
import { RoutePlan } from './pages/RoutePlan';
import { Neighborhood } from './pages/Neighborhood';
import { MapView } from './pages/MapView';
import './App.css';

interface RouteConfig {
  path: string;
  exact?: boolean,
  component: React.ComponentType<any>;
  routes?: RouteConfig[];
}
// 路由配置对象
const routes: RouteConfig[] = [
  {
    path: '/home',
    component: Home,
    routes: [
      {
        path: '/home/map',
        component: Map
      },
      {
        path: '/home/routePlan',
        component: RoutePlan,
      },
      {
        path: '/home/neighborhood',
        component: Neighborhood,
      }
    ]
  },
  {
    path: '/search/mapview',
    exact: true,
    component: MapView,
  }
];

/**
 * 支持嵌套的路由组件
 * @param param0
 */
function RouteWithSubRoutes({ route }: {route: RouteConfig}) {
  return (
    <Route
      exact={route.exact}
      path={route.path}
      render={() => <route.component routes={route.routes}></route.component>}
    >
    </Route>
  );
}
export class App extends React.Component {
  render() {
    return (
      <HashRouter>
        {
          routes.map((route: RouteConfig, index: number) => {
            return <RouteWithSubRoutes key={index} route={route}></RouteWithSubRoutes>;
          })
        }
      </HashRouter>
    );
  }
}