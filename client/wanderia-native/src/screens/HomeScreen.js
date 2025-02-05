import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NavOptions from '../components/NavOptions'

const HomeScreen = () => {
  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='p-5'>
        <Image style={{width:100, height:100, resizeMode:'contain'}} source={{uri:"https://links.papareact.com/gzs"}}></Image>



        <NavOptions/>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})