import {ComponentType} from 'react';
import {NavigationType} from '../enums/navigation';
import HomePageContainer from '../components/pages/HomePageContainer.tsx';
import SplashPageContainer from '../components/pages/SplashPageContainer';

interface RoutesTypes {
  name: string;
  component: ComponentType;
}

const commonRoutes: RoutesTypes[] = [
  {name: NavigationType.SPLASH, component: SplashPageContainer},
  {name: NavigationType.HOME, component: HomePageContainer},
];

export {commonRoutes};
