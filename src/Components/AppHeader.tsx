import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../Utils/Contsants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type AppHeaderProps = {
  title: string;
  onCartPress?: () => void;
  onBack?: boolean;
  SearchBar?: boolean;
  onSearch?: (text: string) => void;
  placeholdertext?: string;
  type: 'ProductList' | 'CartList';
  cartCount?: number;
};

const AppHeader = ({
  title,
  type,
  onBack,
  onCartPress,
  cartCount = 0,
  SearchBar = false,
  onSearch,
  placeholdertext,
}: AppHeaderProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + hp('0.5%'), marginLeft: insets.left, marginRight: insets.right },
      ]}
    >
      {/* Row 1: Back - Title - Cart/Items Count */}
      <View style={styles.row}>
        {/* Back Button */}
        {onBack ? (
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios" size={wp('5%')} color={COLORS.black} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: wp('7%') }} /> // placeholder for alignment
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Cart or Items Count */}
        {type === 'ProductList' ? (
          <TouchableOpacity style={styles.cartWrapper} onPress={onCartPress}>
            <MaterialIcons name="shopping-cart" size={wp('6%')} color={COLORS.black} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.itemCountWrapper}>
            {cartCount > 0 && (
              <Text style={styles.itemCountText}>Items: {cartCount}</Text>
            )}
          </View>
        )}
      </View>

      {/* Row 2: Search Bar */}
      {SearchBar && (
        <View style={styles.searchContainer}>
          <Octicons name="search" size={22} color={"#9ca3af"} />
          <TextInput
            placeholder={placeholdertext}
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            onChangeText={onSearch}
          />
        </View>
      )}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomLeftRadius: wp('6%'),
    borderBottomRightRadius: wp('4.5%'),
    borderColor: '#eee',
    backgroundColor: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: '900',
    color: COLORS.black,
    textAlign: 'center',
  },
  back: {
    padding: wp('2%'),
  },
  cartWrapper: {
    position: 'relative',
    padding: wp('0.5%'),
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -8,
    backgroundColor: 'red',
    borderRadius: wp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: hp('1.9%'),
    minWidth: wp('5%'),
    padding: wp('0.5%'),
  },
  badgeText: {
    color: COLORS.white,
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  itemCountWrapper: {
    minWidth: wp('15%'),
    alignItems: 'flex-end',
    paddingHorizontal: hp('0.8%'),
    paddingVertical: wp('0.5%'),
    borderRadius: 8,
    shadowRadius: 1.41,
  },
  itemCountText: {
    color: COLORS.black,
    fontSize: wp('3.8%'),
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingBlock: hp('0.5%'),
    paddingHorizontal: wp('3%'),
    marginHorizontal: wp('5%'),
    marginVertical: hp('1%'),
    elevation: 2,
  },
  searchInput: {
    color: COLORS.black,
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
    fontWeight: '600',
    flex: 1,
  },
});
