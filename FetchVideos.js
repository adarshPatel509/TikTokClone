import React, { useState, useEffect, useCallback } from 'react';
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
  const videoFeedURI = "https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed";
  
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

  const fetchData = async () => {
    try {
      const res = await fetch(videoFeedURI, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'page': pageNum})
      });
      const resData = await res.json();
    
      updateList(videosList.concat(resData));
      nextPage(pageNum => pageNum + 1);
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setDataProvider((prevState) => prevState.cloneWithRows(videosList))
  }, [videosList]);
  
  const rowRenderer = (type, { node }, index) => {
    return (
      <View style={styles.fullWidth}>
      <Video
        source = {{uri: videosList[index].playbackUrl, type: 'm3u8'}}
        style = {styles.fullScreen}
        rate = {1}
        volume = {1}
      />
      </View>
    )
  };

  const refetch = async () => {
    let newVideos = await fetchData();
    console.log("refetching", videosList.length, pageNum);
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
  },
  fullWidth: {
    width: '100%',
    height: '100%',
  }
});

export default FetchVideos;
