import { View, Text, StyleSheet, Image, Button } from 'react-native'
import React,{useState, useEffect} from 'react'
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
  return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }}
})

import axios from 'axios';
const baseUrl = 'https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/';

export default function StockCard(props) {

    const [stock, setStock] = useState({})

    useEffect(() => {
      // setInterval(() => {
        getStockData(props.stockId)
      // }, 5000);
    }, [])

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }
    
    const getStockData = async (id) =>{
        var stock = {}
        await axios.get(`${baseUrl}/${id}`).then((response) => {
            let res = response.data.data;
            if (res) {
                stock['logo'] = props.stockLogo;
                stock['name'] = res.NSEID;
                stock['currPrice'] = Number(res.pricecurrent);
                stock['priceChange'] = roundToTwo(res.pricechange);
                stock['pricepercentchange'] = roundToTwo(res.pricepercentchange);
                console.log(stock);
                setStock(stock)
            }
        });
    }

    const triggerNotifications = async () => {
      const hasPushNotificationPermissionGranted = await allowsNotificationsAsync()

      if(hasPushNotificationPermissionGranted){
        await Notifications.scheduleNotificationAsync({
        content: {
          title: "You’ve got mail! 📬",
          body: "Here is the notification body",
          data: { data: "goes here" },
        },
        trigger: { seconds: 10 },
        });
      }
    }

  return (
    <View style={styles.stockCard}>
        <Image style={styles.stockLogo} source={{uri:stock.logo}} />
        <View style={{paddingStart: 15}}>
        <Text style={styles.stockName}>{stock.name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <Text style={styles.stockPrice}>{stock.currPrice}</Text>
              <Text style={styles.stockPriceDetails}>{stock.priceChange} ({stock.pricepercentchange})</Text>
          </View>
        </View>
        <Button onPress={triggerNotifications} title="Trigger" color="#841584" accessibilityLabel="Trigger Local Notifications"/>  
    </View>
  )
}

export async function allowsNotificationsAsync() {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

const styles = StyleSheet.create({
    stockCard:{
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderRadius: 12,
        backgroundColor: '#fff4'
      },
      stockLogo:{
        width: 50,
        height: 50,
        borderRadius: 50,
        resizeMode: 'cover'
      },
      stockName:{
          fontFamily: 'Inter_700Bold',
          fontSize: 16,
          color: "#fff",
      },
      stockPrice:{
        fontFamily: 'Inter_700Bold',
        fontSize: 20,
        color: "#13bd4f",
      },
      stockPriceDetails:{
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        paddingStart: 6,
        paddingBottom: 2,
        color: "#fff",
      }
});
  