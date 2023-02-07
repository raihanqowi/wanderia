import * as Icons from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { selectStartNavigation, setStartNavigation } from "../stores/slices/navSlice";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import ConfirmRide from "../components/ConfirmRide";
import NavigateCard from "../components/NavigateCard";
import RideOptionsCard from "../components/RideOptionsCard";
import BussinessInfo from "../components/BussinessInfo";

const MapScreen = () => {
    const stack = createNativeStackNavigator();
    const navigation = useNavigation();
    const startNavigation = useSelector(selectStartNavigation);
    const dispatch = useDispatch();
    const { markerState } = useSelector(state => state.ux);

    return (
      <View className='h-full w-full'>
        <View className='absolute top-16 left-5 z-50 w-10 h-10 items-center justify-center bg-white rounded-full shadow border-[1px] border-gray-200'>
          <TouchableOpacity className='flex-row justify-between' onPress={()=>{
            dispatch(setStartNavigation(false))
            navigation.navigate('HomeScreen')
          }}>
            <Icons.Feather name='arrow-left' className='text-2xl'/>
          </TouchableOpacity>
        </View>

        <View className='flex-1'>
            <Map />
        </View>

        <View style={tw`${!startNavigation || markerState ? "h-1/2 " : "h-0"}`} className='bg-white'>
          <stack.Navigator>
            <stack.Screen name="NavigateCard" component={NavigateCard} options={{ headerShown: false }} style={tw`${!startNavigation ? "h-full " : "hidden"}`}/>
            <stack.Screen name="RideOptionsCard" component={RideOptionsCard} options={{ headerShown: false }} style={tw`${!startNavigation ? "h-full " : "hidden"}`}/>
            <stack.Screen name="ConfirmRide" component={ConfirmRide} options={{ headerShown: false }} style={tw`${!startNavigation ? "h-full " : "hidden"}`}/>
            <stack.Screen name="BussinessInfo" component={BussinessInfo} options={{ headerShown: false }} style={tw`${markerState ? "h-full" : "hidden"}`}/>
          </stack.Navigator>
        </View>
      </View>
    );
};

export default MapScreen;