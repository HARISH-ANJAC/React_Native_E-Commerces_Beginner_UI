import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../Utils/Contsants';
import { clearCart } from '../Redux/Cart/CartSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../Components/CustomTextInput';
import LottieView from 'lottie-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import countryData from '../Utils/Country.json';
import stateData from '../Utils/State.json';
import { isValidEmail, isValidName, isValidPhone } from '../Utils/validators';

const CheckOutScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successModal, setSuccessModal] = useState(false);

  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);

  const [countryItems, setCountryItems] = useState(
    Object.entries(countryData).map(([code, name]) => ({
      label: name,
      value: name,
    })),
  );

  const [stateItems, setStateItems] = useState(
    Object.entries(stateData).map(([code, name]) => ({
      label: name,
      value: name,
      code: code,
    })),
  );
  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { name, email, phone, address, country, state, city } = form;

    if (!name.trim()) newErrors.name = 'Name is required';
    else if (!isValidName(name)) newErrors.name = 'Please enter a valid name';

    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!isValidPhone(phone))
      newErrors.phone = 'Please enter a valid phone number';

    if (email && !isValidEmail(email))
      newErrors.email = 'Please enter a valid email';

    if (!address.trim()) newErrors.address = 'Address is required';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Alert.alert('Error', 'Please fix the highlighted fields.');
      return false;
    }
    return true;
  };

  const handleConfirmOrder = () => {
    if (validateForm()) {
      setSuccessModal(true);
      dispatch(clearCart());
    }
  };

  const renderField = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    required?: boolean,
    keyboardType?: 'default' | 'email-address' | 'phone-pad',
    Inputtype?: 'text' | 'password'|'email' | 'phone' | 'address',
  ) => (
    <>
      <Text style={styles.Label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <CustomTextInput
        type={Inputtype}
        placeholder={placeholder}
        keyboardType={keyboardType || 'default'}
        value={form[key]}
        onChangeText={t => handleChange(key, t)}
        error={errors[key]}
      />
    </>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + hp('0.5%'),
            marginLeft: insets.left,
            marginRight: insets.right,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back-ios"
            size={wp('4.8%')}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CheckOut</Text>
        <View style={{ width: wp('7%') }} />
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              padding: wp('5%'),
              paddingBottom: hp('10%') + insets.bottom,
            }}
          >
            <Text style={styles.PersonalDetails}>Personal Details</Text>
            {renderField('name', 'Name', 'Enter Your Full Name', true,"default","text")}
            {renderField(
              'email',
              'Email',
              'Enter Your Email',
              false,
              'email-address',
              'email'
            )}
            {renderField(
              'phone',
              'Phone',
              'Enter Your Phone Number',
              true,
              'phone-pad',
              'phone'
            )}
            {renderField('address', 'Address', 'Enter Your Address', true,'default','address')}
            {/* Country */}
            <View
              style={[
                styles.dropdownWrapper,
                {
                  zIndex: openCountry ? 3000 : 1,
                  elevation: openCountry ? 3 : 0,
                },
              ]}
            >
              
              <Text style={styles.Label}>
                
                Country <Text style={styles.required}>*</Text>
              </Text>
              <DropDownPicker
                open={openCountry}
                value={form.country}
                items={countryItems}
                setOpen={val => {
                  setOpenCountry(val);
                  setOpenState(false);
                  setOpenCity(false);
                }}
                listMode="SCROLLVIEW"
                setValue={cb => {
                  const value = cb(form.country);
                  handleChange('country', value as string);
                }}
                setItems={setCountryItems}
                placeholder="Select Country"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
              {(openCountry&&form.country) && (
                <Text style={styles.errorText}>Please select a country</Text>
              )}
            </View>
            {/* State */}
            <View
              style={[
                styles.dropdownWrapper,
                { zIndex: openState ? 2000 : 1, elevation: openState ? 2 : 0 },
              ]}
            >
              
              <Text style={styles.Label}>
                
                State <Text style={styles.required}>*</Text>
              </Text>
              <DropDownPicker
                open={openState}
                value={form.state}
                items={stateItems}
                searchable={true}
                searchPlaceholder="Search city..."
                onChangeSearchText={t => {
                  const filteredItems = stateItems.filter(item =>
                    item.code.toUpperCase().includes(t.toUpperCase()),
                  );
                  setStateItems(filteredItems);
                }}
                dropDownDirection="TOP"
                setOpen={val => {
                  setOpenState(val);
                  setOpenCountry(false);
                  setOpenCity(false);
                }}
                setValue={cb => {
                  const value = cb(form.state);
                  handleChange('state', value as string);
                }}
                listMode="SCROLLVIEW"
                setItems={setStateItems}
                placeholder="Select State"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
              {(form.state === ''&&openState ) && (
                <Text style={styles.errorText}>Please Select State</Text>
              )}
            </View>
            {renderField('city', 'City', 'Enter Your City', true)}
            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirmOrder}
            >
              <Text style={styles.confirmText}>Confirm Order</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LottieView
              autoPlay
              speed={0.6}
              source={require('../assets/LottieAnimation/OrderCompleted.json')}
              style={{ width: wp('40%'), height: wp('40%') }}
            />
            <Text style={styles.successTitle}>Congratulations</Text>
            <Text style={styles.successMsg}>
              Your order placed successfully, thank you for purchasing
              <Text style={{ color: COLORS.primary, fontWeight: '900' }}>
                {` ${form.name.trim()}`}
              </Text>
              .
            </Text>
            <TouchableOpacity
              style={styles.goBackBtn}
              onPress={() => {
                setSuccessModal(false);
                navigation.navigate('Products');
              }}
            >
              <Text style={styles.goBackText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckOutScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: COLORS.primary,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp('5%'),
    fontWeight: '600',
    color: COLORS.black,
  },
  PersonalDetails: {
    marginBottom: hp('1%'),
    fontWeight: '600',
    fontSize: wp('4.5%'),
  },
  Label: { marginBottom: hp('0.5%'), fontSize: wp('4%'), marginTop: hp('1%') },
  required: { color: 'red' },
  dropdownWrapper: { marginTop: hp('1%') },
  dropdown: {
    marginTop: hp('0.5%'),
    borderColor: COLORS.Slate_Gray,
    borderWidth: 1,
  },
  dropdownContainer: { borderColor: COLORS.Slate_Gray },
  errorText: { color: 'red', fontSize: wp('3.3%'), marginTop: hp('0.3%') },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: hp('1.8%'),
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  confirmText: { color: COLORS.black, fontSize: wp('4.5%'), fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: wp('85%'),
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: wp('6%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  successTitle: { fontSize: wp('5%'), fontWeight: '700', color: COLORS.black },
  successMsg: {
    fontSize: wp('4%'),
    color: COLORS.Slate_Gray,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: wp('5.8%'),
    marginVertical: hp('1.5%'),
  },
  goBackBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('8%'),
    marginTop: hp('2%'),
  },
  goBackText: { fontSize: wp('4%'), fontWeight: '600', color: COLORS.black, textAlign: 'center'},
});
