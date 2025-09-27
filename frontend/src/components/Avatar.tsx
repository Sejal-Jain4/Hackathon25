import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ViewStyle, 
  StyleProp, 
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../services/theme-service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: ImageSourcePropType;
  size?: AvatarSize;
  name?: string;
  icon?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  badgeColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  name,
  icon,
  onPress,
  style,
  badgeColor,
}) => {
  const { theme } = useTheme();
  
  const getSize = () => {
    switch (size) {
      case 'tiny':
        return 24;
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      case 'xlarge':
        return 96;
      default:
        return 48;
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case 'tiny':
        return 10;
      case 'small':
        return 12;
      case 'medium':
        return 18;
      case 'large':
        return 24;
      case 'xlarge':
        return 36;
      default:
        return 18;
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'tiny':
        return 14;
      case 'small':
        return 18;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      case 'xlarge':
        return 48;
      default:
        return 24;
    }
  };
  
  const avatarSize = getSize();
  
  const getInitials = () => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  const avatarContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={[
            styles.image,
            { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
          ]}
          resizeMode="cover"
        />
      );
    }
    
    if (icon) {
      return (
        <View
          style={[
            styles.iconContainer,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={icon as any}
            size={getIconSize()}
            color="#FFFFFF"
          />
        </View>
      );
    }
    
    return (
      <View
        style={[
          styles.initialsContainer,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: theme.colors.secondary,
          },
        ]}
      >
        <Text style={{ fontSize: getFontSize() }} color="#FFFFFF">
          {getInitials()}
        </Text>
      </View>
    );
  };
  
  const avatarWithBadge = () => {
    return (
      <View style={styles.container}>
        {avatarContent()}
        
        {badgeColor && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: badgeColor,
                width: avatarSize / 3,
                height: avatarSize / 3,
                borderRadius: avatarSize / 3,
                borderWidth: avatarSize > 32 ? 2 : 1,
              },
            ]}
          />
        )}
      </View>
    );
  };
  
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[style]}
        activeOpacity={0.8}
      >
        {avatarWithBadge()}
      </TouchableOpacity>
    );
  }
  
  return <View style={[style]}>{avatarWithBadge()}</View>;
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#EFEFEF',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: '#FFFFFF',
  },
});