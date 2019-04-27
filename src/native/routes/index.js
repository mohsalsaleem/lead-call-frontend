import React from 'react';
import { Scene, Tabs, Stack } from 'react-native-router-flux';
import { Icon } from 'native-base';

import DefaultProps from '../constants/navigation';
import AppConfig from '../../constants/config';

import RecipesContainer from '../../containers/Recipes';
import RecipeListingComponent from '../components/Recipe/Listing';
import RecipeSingleComponent from '../components/Recipe/Single';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/User/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/User/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/User/ForgotPassword';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/User/UpdateProfile';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/User/Profile';

// import AboutComponent from '../components/About';
import Leads from '../components/Leads/Leads';
import Campaigns from '../components/Campaign/campaign';

const Index = (
  <Stack hideNavBar>
    <Scene
        key="login"
        back={true}
        title={AppConfig.appName.toUpperCase()}
        icon={() => <Icon name="planet" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
        component={LoginContainer}
        Layout={LoginComponent}/>
    <Scene
        key="SignUp"
        back={true}
        title={AppConfig.appName.toUpperCase()}
        icon={() => <Icon name="planet" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
        component={SignUpContainer}
        Layout={SignUpComponent}/>
    <Stack
        key="home"
        title={AppConfig.appName.toUpperCase()}
        icon={() => <Icon name="planet" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
      >
        <Scene key="campaigns" component={Campaigns}/>
        <Scene key="leads" component={Leads} />
      </Stack>
  </Stack>
);

export default Index;
