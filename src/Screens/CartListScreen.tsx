import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../Redux/Cart/CartSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../Components/AppHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../Utils/Contsants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import IncreaseButton from '../Components/IncreaseButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

const CartListScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleCountChange = (id: string, newCount: number, oldCount: number) => {
    if (newCount > oldCount) {
      dispatch(increaseQuantity(id));
    } else if (newCount < oldCount) {
      dispatch(decreaseQuantity(id));
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="My Cart"
        type="CartList"
        onBack={true}
        onCartPress={() => navigation.navigate('Cart')}
        cartCount={cartItems.length}
      />

      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: wp('4%'), paddingBottom: hp('12%') }}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <View style={styles.cartCard}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={
                      item.image
                        ? { uri: item.image }
                        : require('../assets/Stutzen logo.jpg')
                    }
                    style={styles.image}
                  />
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.priceText}>
                    ₹ {(item.price * item.quantity).toFixed(2)}
                  </Text>

                  <View>
                    <IncreaseButton
                    initialCount={item.quantity}
                    OnCount={newCount =>
                      handleCountChange(item.id, newCount, item.quantity)
                    }
                  />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => dispatch(removeFromCart(item.id))}
                >
                  <MaterialIcons
                    name="delete"
                    size={wp('6%')}
                    color={COLORS.red}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContent}>
          <MaterialIcons
            name="remove-shopping-cart"
            size={wp('20%')}
            color={COLORS.primary}
          />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      )}

      {cartItems.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: insets.bottom + hp('1.5%') },
          ]}
        >
          <View>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>₹ {totalAmount.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('Checkout', { total: totalAmount })}
          >
            <Text style={styles.checkoutText}>Check Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CartListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: COLORS.black,
    marginTop: hp('2%'),
  },
  cardContainer: {
    marginBottom: hp('2%'),
  },
  cartCard: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: COLORS.white,
    padding: wp('3%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 5,
  },
  imageWrapper: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  productName: {
    fontSize: wp('4.2%'),
    fontWeight: '600',
    color: COLORS.black,
  },
  priceText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: hp('0.7%'),
  },
  removeIcon: {
    padding: wp('1%'),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: '#eaeaea',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  totalText: {
    fontSize: wp('5.5%'),
    color: COLORS.Slate_Gray,
    fontWeight: '800',
  },
  totalAmount: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.5%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  checkoutText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: COLORS.black,
  },
});
