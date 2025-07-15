import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatItemData {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats: StatItemData[];
}

const StatItem: React.FC<StatItemData> = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const StatDivider: React.FC = () => <View style={styles.statDivider} />;

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <StatItem value={stat.value} label={stat.label} />
          {index < stats.length - 1 && <StatDivider />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1c1c42',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
});

export default StatsSection; 