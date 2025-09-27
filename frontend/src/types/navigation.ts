import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the auth stack param list
export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

// Define the main tab navigator param list
export type MainTabParamList = {
  Dashboard: undefined;
  Goals: undefined;
  AIChat: undefined;
  Insights: undefined;
  Profile: undefined;
};

// Define the root stack param list
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
};

// Define screen props for auth stack screens
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

// Define screen props for main tab screens
export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Export the navigation object type
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}