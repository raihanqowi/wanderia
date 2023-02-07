import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import React, { useEffect, useState, useRef } from "react"
import MapView, { Marker, setCamera } from "react-native-maps"
import tw from "tailwind-react-native-classnames"
import { useSelector } from "react-redux"
import { selectOrigin, selectDestination, selectWaypoints, setTravelTimeInformation, selectStartNavigation } from "../stores/slices/navSlice"
import MapViewDirections from "react-native-maps-directions"
import { useDispatch } from "react-redux"
import * as Location from "expo-location"
import * as Icons from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Map = () => {
  const navigator = useNavigation()
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const waypoints = useSelector(selectWaypoints)
  const mapRef = useRef(null)
  const dispatch = useDispatch()
  const startNavigation = useSelector(selectStartNavigation)

  useEffect(() => {
    mapRef.current.setCamera({
      center: {
        latitude: origin.location.lat,
        longitude: origin.location.lng,
      },
      pitch: 60,
      heading: 0,
      altitude: 1000,
      zoom: 20,
      duration: 3000
      })
  },[])

  return (
    <>
      <View className='absolute top-16 left-5 z-50 w-10 h-10 items-center justify-center bg-white rounded-full shadow border-[1px] border-gray-200'>
        <TouchableOpacity className='flex-row justify-between' onPress={()=>navigator.navigate('HomeScreen')}>
          <Icons.Feather name='arrow-left' className='text-2xl'/>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={tw`h-full w-full`}
        mapType="mutedStandard"
        initialRegion={{
          // use device current location
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsMyLocationButton={true}
      >

      {
        (origin && destination && waypoints) && 
        <MapViewDirections
          origin={origin.description}
          destination={destination.description}
          waypoints={
            waypoints.map(el=> {return {"longitude":+el.longitude,"latitude":+el.latitude}})
          }
          apikey="AIzaSyCPqKoUKVc1aUxhG4vGluGxF3OOr8ProL4"
          strokeWidth={3}
          strokeColor="blue"
        />
      }

      {
        origin?.location && 
        <Marker title="Origin" description={origin.description} identifier="origin"
          coordinate={{ latitude: origin.location.lat, longitude: origin.location.lng }}
        />
      }

      {
        destination?.location && 
        <Marker title="Destination" description={destination.description} identifier="destination"
          coordinate={{ latitude: destination.location.lat, longitude: destination.location.lng }}
        />
      }

      {
        waypoints?.map((waypoint, index) => { return (
          <Marker key={index} title="Waypoint" description={waypoint.description} identifier="waypoint"
            coordinate={{ latitude: +waypoint.latitude, longitude: +waypoint.longitude }}
          />
        )})
      }
      </MapView>
    </>
  )
}

export default Map;