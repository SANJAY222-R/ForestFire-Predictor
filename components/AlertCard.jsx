import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const AlertCard = ({ alert, onPress = null }) => {
  const { colors } = useContext(ThemeContext);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'maintenance': return 'construct-outline';
      case 'risk': return 'flame-outline';
      case 'info': return 'information-circle-outline';
      case 'warning': return 'warning-outline';
      default: return 'notifications-outline';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'maintenance': return colors.info;
      case 'risk': return colors.highRisk;
      case 'warning': return colors.warning;
      default: return colors.primary;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'maintenance': return '🔧 Maintenance';
      case 'risk': return '🔥 Risk';
      case 'warning': return '⚠️ Warning';
      case 'info': return 'ℹ️ Info';
      default: return '📢 Alert';
    }
  };

  const CardContent = () => (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getAlertColor(alert.type) + '20' }]}>
          <Ionicons 
            name={getAlertIcon(alert.type)} 
            size={20} 
            color={getAlertColor(alert.type)} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{alert.title}</Text>
          <Text style={[styles.time, { color: colors.textLight }]}>{alert.time}</Text>
        </View>
        <View style={styles.badgeContainer}>
          <View style={[styles.typeBadge, { backgroundColor: getAlertColor(alert.type) }]}>
            <Text style={[styles.typeText, { color: colors.surface }]}>{getTypeLabel(alert.type)}</Text>
          </View>
          {!alert.is_read && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="ellipse" size={8} color={colors.surface} />
            </View>
          )}
        </View>
      </View>
      
      <Text style={[styles.message, { color: colors.textSecondary }]}>{alert.message}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={() => onPress(alert)} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.cardTitle,
    fontSize: 16,
  },
  time: {
    ...typography.caption,
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    ...typography.body2,
    lineHeight: 18,
  },
});

export default AlertCard;