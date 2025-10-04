import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../Utils/Contsants';

interface IncreaseButtonProps {
  initialCount?: number;
  OnCount: (count: number) => void;
}

const IncreaseButton = ({ initialCount = 1, OnCount }: IncreaseButtonProps) => {
  const [count, setCount] = useState(initialCount);
  const isMounted = useRef(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const increase = () => {
    const newCount = count + 1;
    setCount(newCount);
    OnCount(newCount);
  };

  const decrease = () => {
    const newCount = Math.max(1, count - 1);
    setCount(newCount);
    OnCount(newCount);
  };

  return (
    <View style={styles.container}>
      {/* Decrease Button */}
      <TouchableOpacity style={styles.button} onPress={decrease}>
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>

      {/* Count */}
      <View style={styles.countWrapper}>
        <Text style={styles.countText}>{count}</Text>
      </View>

      {/* Increase Button */}
      <TouchableOpacity style={styles.button} onPress={increase}>
        <Text style={styles.btnText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncreaseButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.6%'),
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
  },
  button: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('2%'),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  btnText: {
    fontSize: wp('3.9%'),
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: hp('-0.3%'),
  },
  countWrapper: {
    minWidth: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: COLORS.black,
  },
});
