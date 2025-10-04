// ProductListScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import { COLORS } from '../Utils/Contsants';
import AppHeader from '../Components/AppHeader';
import { Product } from '../@types';
import { RootState } from '../Redux/Store';
import { useSelector } from 'react-redux';
import ProductCard from '../Components/ProductCard';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = () => {
  const insets =useSafeAreaInsets();
  const products = useSelector((state: RootState) => state.products.products);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />

      {/* Top Bar */}
      <AppHeader
        title="Products"
        type="ProductList"
        SearchBar={true}
        placeholdertext="Search products"
        onSearch={(text: string) => handleSearch(text)}
        cartCount={cartItems.length}
        onCartPress={() => navigation.navigate('Cart')}
      />

      {/* Product List */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
            numColumns={2}
            renderItem={({ item }) => (
              <ProductCard product={item} />   // ⬅️ no need for onAddToCart
            )}
            keyExtractor={item => item.id}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              paddingHorizontal: wp('2%'),
            }}
            contentContainerStyle={{
              paddingBottom: insets.bottom + hp('1.5%'),
            }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Products Found</Text>
        </View>
      )}
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cartIcon: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -hp('0.6%'),
    right: -wp('2%'),
    backgroundColor: 'red',
    borderRadius: wp('5%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
  },
  cartCount: {
    color: COLORS.white,
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  searchBox: {
    borderWidth: 1,
    borderColor: COLORS.Slate_Gray,
    borderRadius: wp('2%'),
    padding: wp('3%'),
    margin: wp('3%'),
  },
  productCard: {
    flexDirection: 'row',
    padding: wp('3.5%'),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Light_Gray,
  },
  image: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('2%'),
  },
  name: {
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  price: {
    fontSize: wp('3.5%'),
    color: COLORS.Muted_Gray,
    marginVertical: hp('0.5%'),
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('3.5%'),
    borderRadius: wp('2%'),
    alignSelf: 'flex-start',
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: wp('3.8%'),
  },
  outOfStock: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: hp('2.5%'),
    color: COLORS.Muted_Gray,
  },
});
