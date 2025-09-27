import { MaterialCommunityIcons } from '@expo/vector-icons';

// Define icon names type
export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// App colors
export const AppColors = {
  primary: '#5B37B7',
  secondary: '#FF8E53',
  success: '#28C76F',
  danger: '#EA5455',
  warning: '#FF9F43',
  info: '#00CFE8',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#F8F7FA',
  lightGray: '#EAE8ED',
  darkGray: '#666666',
  background: '#F9F9F9',
};

// App constants for icons
export const AppIcons = {
  // Finance
  wallet: 'wallet' as IconName,
  bank: 'bank' as IconName,
  creditCard: 'credit-card' as IconName,
  cash: 'cash' as IconName,
  currencyUsd: 'currency-usd' as IconName,
  
  // Goals
  target: 'target' as IconName,
  trophy: 'trophy' as IconName,
  flag: 'flag' as IconName,
  
  // Categories
  food: 'food' as IconName,
  shoppingOutline: 'shopping-outline' as IconName,
  home: 'home' as IconName,
  car: 'car' as IconName,
  school: 'school' as IconName,
  cellphone: 'cellphone' as IconName,
  gasStation: 'gas-station' as IconName,
  medical: 'medical-bag' as IconName,
  filmstrip: 'filmstrip' as IconName,
  hanger: 'hanger' as IconName,
  
  // UI
  plus: 'plus' as IconName,
  minus: 'minus' as IconName,
  check: 'check' as IconName,
  close: 'close' as IconName,
  edit: 'pencil' as IconName,
  delete: 'delete' as IconName,
  account: 'account' as IconName,
  settings: 'cog' as IconName,
  notification: 'bell' as IconName,
  search: 'magnify' as IconName,
  calendar: 'calendar' as IconName,
  chart: 'chart-line' as IconName,
  robot: 'robot' as IconName,
  eye: 'eye-outline' as IconName,
  transfer: 'transfer' as IconName,
};