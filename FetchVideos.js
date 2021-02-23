/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { 
  RecyclerListView, 
  DataProvider, 
  LayoutProvider,
  RefreshControl
} from "recyclerlistview";

import Video from 'react-native-video';

const window = Dimensions.get('window');

const FetchVideos: () => React$Node = () => {
  const [videosList, updateList] = useState([]);
  const [pageNum, nextPage] = useState(0);
  const streamUrl = "https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed";
  
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2
    })
  );
  
  const [layoutProvider] = useState(
    new LayoutProvider(
      (index) => 1,
      (type, dim) => {
        dim.width = window.width
        dim.height = window.height
      }
    )
  );

  useEffect(() => {
    fetch(streamUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'page': pageNum})
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      updateList(videosList.concat(data));
      nextPage(pageNum => pageNum + 1);
      console.log(videosList, pageNum);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    setDataProvider((prevState) => prevState.cloneWithRows(videosList))
  }, [videosList]);
  
  const rowRenderer = (type, { node }, index) => {
    return (
      <View style={styles.fullScreen}>
      <Video
        source = {{uri: videosList[index].playbackUrl, type: 'm3u8'}}
        style = {styles.fullScreen}
        rate = {1}
        volume = {1}
      />
      </View>
    )
  };

  const refetch = () => {
    console.log("refetching");
    console.log(videosList.length);
  }

  return (
    videosList.length != 0 ?
    <RecyclerListView
      style={{ flex: 1 }}
      layoutProvider={layoutProvider}
      dataProvider={dataProvider}
      rowRenderer={rowRenderer}
      onEndReached={refetch}
    /> : <></>
  );
};

const styles = StyleSheet.create({
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  fullScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  }
});

export default FetchVideos;
