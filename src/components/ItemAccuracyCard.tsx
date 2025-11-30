import Shape from '@/components/shape';
import { ItemAccuracy } from '@/service/answers.service';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ItemAccuracyCardProps {
  data: ItemAccuracy;
}

export const ItemAccuracyCard: React.FC<ItemAccuracyCardProps> = ({ data }) => {
  const total = data.correct + data.wrong;
  const accuracy = (data.correct / total) * 100;

  const getColors = (acc: number) => {
    if (acc >= 90) return { bg: 'green', border: '#006400' };
    if (acc >= 75) return { bg: 'greenyellow', border: '#9ACD32' };
    if (acc >= 50) return { bg: 'yellow', border: '#FFD700' };
    if (acc >= 25) return { bg: 'orange', border: '#FF8C00' };
    return { bg: 'red', border: '#8B0000' };
  };

  const colors = getColors(accuracy);

  const renderItemContent = () => {
    const itemLower = data.item.toLowerCase().trim().replace('.', '');
    const color = "black";

    switch (itemLower) {
      case 'circle':
        return <View style={styles.shape}><Shape shape="circle" color={color} size={4} /></View>;
      case 'square':
        return <View style={styles.shape}><Shape shape="square" color={color} size={4} /></View>;
      case 'rectangle':
        return <View style={styles.shape}><Shape shape="rectangle" color={color} size={4} /></View>;
      case 'triangle':
        return <View style={styles.shape}><Shape shape="triangle" color={color} size={4} /></View>;
      case 'star':
        return <View style={styles.shape}><Shape shape="star" color={color} size={4} /></View>;
      default:
        return <Text style={styles.itemTitle}>{data.item}</Text>;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <View style={styles.header}>
        {renderItemContent()}
        <Text style={styles.accuracy}>{accuracy.toFixed(0)}%</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Corretos: {data.correct}</Text>
        <Text style={styles.detailText}>Errados: {data.wrong}</Text>
        <Text style={styles.detailText}>Total: {total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: '100%',  
    maxWidth: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderWidth: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 16,
    lineHeight: 70, // Adjust line height to prevent clipping
  },
  shape: {
    marginRight: 16,
  },
  accuracy: {
    fontSize: 32,
    fontWeight: '400',
    color: '#000',
  },
  detailsContainer: {
    marginTop: 0,
  },
  detailText: {
    fontSize: 24,
    color: '#000',
    marginBottom: 4,
    fontWeight: '400',
  },
});
