import { View, Text, StyleSheet, Image } from 'react-native'
import React,{useState, useEffect} from 'react'

import axios from 'axios';
const baseUrl = 'https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/';

export default function StockCard(props) {

    const [stock, setStock] = useState({})

    useEffect(() => {
        getStockData(props.stockId)
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
    </View>
  )
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
  