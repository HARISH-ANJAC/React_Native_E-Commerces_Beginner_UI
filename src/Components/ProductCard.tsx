// ProductCard.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../Utils/Contsants';
import { Product } from '../@types';
import { addToCart } from '../Redux/Cart/CartSlice';

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void; // Optional prop for custom add to cart handling
}

// ProductCard.tsx
const ProductCard: React.FC<Props> = ({ product,onAddToCart}) => {
  const dispatch = useDispatch();

const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      dispatch(addToCart(product)); // ✅ uses slice
    }
  };
  return (
    <View style={styles.card}>
      {/* Product Image */}
      <Image
        source={
          product.image?.startsWith('data:image')
            ? { uri: product.image }
            : product.image
            ? { uri: product.image }
            : require('../assets/Stutzen logo.jpg')
        }
        style={styles.img}
        resizeMode="contain"
      />

      {/* Info */}
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>

      {/* Action */}
      {product.inStock ? (
        <TouchableOpacity onPress={handleAddToCart} style={styles.addBtn}>
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.outOfStock}>Out of Stock</Text>
      )}
    </View>
  );
};

export default ProductCard;
const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: wp('2%'),
    padding: wp('3%'),
    borderRadius: wp('3%'),
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center', // center inside column
  },
  img: {
    width: '100%',
    height: hp('15%'),
    borderRadius: wp('2%'),
  },
  name: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: COLORS.black,
    marginTop: hp('0.8%'),
    textAlign: 'center',
  },
  price: {
    fontSize: wp('3.5%'),
    color: COLORS.Muted_Gray,
    marginTop: hp('0.3%'),
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    marginTop: hp('0.8%'),
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: wp('3.3%'),
  },
  outOfStock: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: wp('3.3%'),
    marginTop: hp('0.8%'),
  },
});
