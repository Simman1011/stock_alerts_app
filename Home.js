import { StyleSheet, ScrollView } from 'react-native';
import React from 'react'

const stockData = [
    {
        id: 'ICI02',
        logo: 'https://asset.brandfetch.io/idJHpX8apR/ids8EgwKY1.png',
        buyPrice: 820,
        target: 830
    },
    {
        id: 'UTI10',
        logo: 'https://play-lh.googleusercontent.com/nNyS8pk_qjq2BNwGO6ESd8B52HRiMWDvDabNKyUu28uwmVUgxcBWOGkEraUNEQmZHPA=w240-h480-rw',
        buyPrice: 820,
        target: 830
    },
]

import StockCard from './components/StockCard';

export default function Home() {

  return (
    <ScrollView style={styles.container}>
      {stockData && stockData.length > 0 && 
        stockData.map((stock, index) =>{
            return(
                <StockCard stockData={stock} key={index} />
            )
        })
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#241041',
      paddingVertical: 50,
      paddingHorizontal: 20
    },
});
  