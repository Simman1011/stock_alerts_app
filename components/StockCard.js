import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native'
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

    let { stockData } = props;

    const [stock, setStock] = useState({})
    const [isMute, seIsMute] = useState(false)

    useEffect(() => {
      // setInterval(() => {
        getStockData(stockData.id)
      // }, 10000);
    }, [])

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }
    
    const getStockData = async (id) =>{
        var stock = {}
        await axios.get(`${baseUrl}/${id}`).then((response) => {
            let res = response.data.data;
            if (res) {
                stock['logo'] = stockData.logo;
                stock['name'] = res.NSEID;
                stock['currPrice'] = Number(res.pricecurrent);
                stock['priceChange'] = roundToTwo(res.pricechange);
                stock['pricepercentchange'] = roundToTwo(res.pricepercentchange);
                stock['buyPrice'] = stockData.buyPrice;
                stock['target'] = stockData.target;
                // console.log(notifySended.find(ns => ns === id));
                console.log(isMute);
                if (!isMute) {
                  if ((Number(res.pricecurrent)) <= stockData.buyPrice) {
                    triggerNotifications({
                      title: "Stock on buy range 🔔",
                      body: `${stock.name} stock price cross Rs.${stock.buyPrice}`,
                    })
                  }
                  if ((Number(res.pricecurrent)) >= stockData.target) {
                    triggerNotifications({
                      title: "Trade hit the target 💥",
                      body: `${stock.name} stock price cross Rs.${stock.target}`,
                    })
                  } 
                }
                // console.log(stock);
                setStock(stock)
            }
        });
    }

    // const toggleStockMute = (name) =>{
    //   let stocks = muteStocks;
    //   let index = stocks.indexOf(name)
    //   if (index) {
    //     stocks.splice(index, 1);
    //     setMuteStocks(stocks);
    //   }else{
    //     setMuteStocks([...muteStocks, name])
    //   }
    // }

    const triggerNotifications = async (notifyMeg) => {
      const hasPushNotificationPermissionGranted = await allowsNotificationsAsync()

      if(hasPushNotificationPermissionGranted){
        await Notifications.scheduleNotificationAsync({
        content: {
          title: notifyMeg.title,
          body: notifyMeg.body,
          data: { data: "goes here" },
        },
        sound: 'default',
        trigger: { seconds: 1 },
        });
      }
    }

  return (
    <TouchableOpacity style={styles.stockCard} onPress={()=>seIsMute(!isMute)}>
        {isMute &&
          <Text style={styles.muteIcon}>🔕</Text>
        }
        <Image style={styles.stockLogo} source={{uri:stock.logo}} />
        <View style={{paddingStart: 12}}>
          <Text style={styles.stockName}>{stock.name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text style={styles.stockPrice}>{stock.currPrice}</Text>
            <Text style={styles.stockPriceDetails}>{stock.priceChange} ({stock.pricepercentchange})</Text>
          </View>
        </View>
        <View style={styles.buyText}>
          <Text style={styles.stockBuyPrice}>📍 {stock.buyPrice}</Text>
          <Text style={styles.stockBuyPrice}>🎯 {stock.target}</Text>
        </View>
    </TouchableOpacity>
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
        position: 'relative',
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
      },
      buyText:{
        paddingStart: 10,
        marginStart: 15,
        borderLeftWidth: 1,
        borderColor: '#fff',
      },
      label:{
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
        paddingBottom: 2,
        color: "#fff",
      },
      stockBuyPrice:{
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
        color: "#fff",
      },
      muteIcon:{
        position: 'absolute',
        top: 5,
        left: 5,
        fontSize: 20,
        zIndex: 1
      }
});
  