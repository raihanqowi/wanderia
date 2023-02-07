import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { useSelector } from "react-redux";
import { selectOrigin, selectDestination, selectWaypoints, setBoundsWaypoint } from "../stores/slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { useDispatch } from "react-redux";
import { setTravelTimeInformation, selectStartNavigation, } from "../stores/slices/navSlice";
import * as Icons from "@expo/vector-icons";
import { mapMarkers, openMarker } from "../stores/actionCreator";

const Map = () => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const waypoints = useSelector(selectWaypoints);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const startNavigation = useSelector(selectStartNavigation);
  const [ bounds, setBounds ] = useState(null);
  const { markerState, markers: bussinessMarker } = useSelector((state) => state.ux)

  const getMarkers = async () => {
    await dispatch(mapMarkers());
  };

  useLayoutEffect(() => {
      getMarkers();
  }, []);

  useEffect(() => {
    if (!origin || !destination) return;
    mapRef.current.fitToSuppliedMarkers(
      ["origin", "destination"],
      { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 } }
    );
  }, [origin, destination]);

  useEffect(() => {
    if (!startNavigation) return;
    mapRef.current.fitToSuppliedMarkers(["origin"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  }, [startNavigation]);

  const onRegionChangeComplete = () => {
    mapRef.current.getMapBoundaries().then((map) => {
      dispatch(setBoundsWaypoint(map));
      setBounds(map);
    });
  };

  const filterMarkers = (bussinessMarker, bounds) => {
    return bussinessMarker.filter(
      (marker) =>
        marker.latitude >= bounds.southWest.latitude-0.005 &&
        marker.latitude <= bounds.northEast.latitude+0.005 &&
        marker.longitude >= bounds.southWest.longitude-0.005 &&
        marker.longitude <= bounds.northEast.longitude+0.005
    )
  }

  useEffect(() => {
    if (!origin || !destination) return;
    const getTravelTime = async () => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.description}&destinations=${destination.description}&key=AIzaSyCPqKoUKVc1aUxhG4vGluGxF3OOr8ProL4`)
      .then((res) => res.json())
      .then((data) => {
        dispatch( setTravelTimeInformation(data.rows[0].elements[0]) );
      });
    };
    getTravelTime();
  }, [origin, destination]);

  return (
    <MapView
      ref={mapRef}
      onRegionChangeComplete={onRegionChangeComplete}
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
      camera={
        startNavigation ? {
          center: {
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          },
          pitch: 60,
          heading: 0,
          altitude: 1000,
          zoom: 20,
        } : {
          center: {
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          },
          zoom: 20,
        }
      }
    >

      {origin && destination && waypoints && (
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
      )}

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

      { bounds && startNavigation &&
          filterMarkers(bussinessMarker, bounds).map((marker, index) => {
            return (
            <Marker key={'marker'+index} 
              coordinate={{
                latitude: +marker.latitude,
                longitude: +marker.longitude}
              } title={marker.name} description='origin'>
                <View className='p-2 bg-white rounded-full shadow border-[1px] border-gray-200'>
                  <Text className='text-3xl'>{String.fromCodePoint(parseInt (marker.icon, 16))}</Text>
                </View>
                <Callout tooltip>
                  <View className="h-16 w-56 bg-white rounded-xl">
                    <TouchableOpacity className='pl-2 h-full w-full bg-white rounded-xl flex-row flex-1 items-center border-[1px] border-gray-200 shadow'
                      onPress={()=>{
                        console.log('tap >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                        dispatch(openMarker(marker.id))
                      }}>
                      <Image source={{uri:marker.imageUrl}} className='h-12 w-12 rounded-xl'/>
                      <View className='flex-1 px-1'>
                        <View>
                          <Text className='text-lg'>{marker.name?.length>20?marker.name.slice(0,17)+'...':marker.name}</Text>
                          <Text className='text-xs font-light text-gray-500'>{marker.address?.length>20?marker.address.slice(0,20)+'...':marker.address}</Text>
                        </View>
                      </View>
                      <View className='h-full w-8 rounded-r-xl pr-2'>
                        <View className='flex-1 w-full h-full items-center justify-center border-b-[1px] border-gray-200'>
                          <Icons.FontAwesome5 name="users" className='text-xl text-gray-800'/>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Callout>
            </Marker>
          )})
        }
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});