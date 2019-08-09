import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Map } from './pages/Map';
import { RoutePlan } from './pages/RoutePlan';
import { Neighborhood } from './pages/Neighborhood';
import { VideoPlayer } from './pages/Video';
import './App.css';

// export interface AppState {
//   selected: string,
// }
// export class App extends React.Component<any, AppState> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       selected: 'map',
//     };
//   }
//   render() {
//     const color = 'rgba(255,255,255,.5)';
//     const selectedColor= '#fff';
//     return (
//       <div className="app">
//         <TabBar
//           tabBarPosition="top"
//           barTintColor="#3D92FB"
//           unselectedTintColor={color}
//           tintColor={selectedColor}
//         >
//           <TabBar.Item
//             key="map"
//             title="地图"
//             icon={<Icon type="icon-ditu" size="md" color={color}></Icon>}
//             selectedIcon={<Icon type="icon-ditu" size="md" color={selectedColor}></Icon>}
//             selected={this.state.selected === 'map'}
//             onPress={() => this.setState({ selected: 'map' })}
//           >
//             <Map></Map>
//           </TabBar.Item>

//           <TabBar.Item
//             key="route"
//             title="路线"
//             icon={<Icon type="icon-route" size="md" color={color}></Icon>}
//             selectedIcon={<Icon type="icon-route" size="md" color={selectedColor}></Icon>}
//             selected={this.state.selected === 'route'}
//             onPress={() => this.setState({ selected: 'route' })}
//           >

//           </TabBar.Item>
          
//           <TabBar.Item
//             key="neighborhood"
//             title="附近"
//             icon={<Icon type="icon-fujin1" size="md" color={color}></Icon>}
//             selectedIcon={<Icon type="icon-fujin1" size="md" color={selectedColor}></Icon>}
//             selected={this.state.selected === 'neighborhood'}
//             onPress={() => this.setState({ selected: 'neighborhood' })}
//           >

//           </TabBar.Item>
//         </TabBar>
//       </div>
//     );
//   }
// }
interface RouteConfig {
  path: string;
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
    path: '/video',
    component: VideoPlayer,
  }
];

function RouteWithSubRoutes({ route }: {route: RouteConfig}) {
  // const component: any = route.component;
  return (
    <Route
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
        <Switch>
          {
            routes.map((route: RouteConfig, index: number) => (<RouteWithSubRoutes key={index} route={route}></RouteWithSubRoutes>))
          }
        </Switch>
      </HashRouter>
    );
  }
}