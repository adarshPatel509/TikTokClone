import React, { useState, useEffect } from 'react';

import {
  Dimensions,
} from 'react-native';

import { 
  RecyclerListView, 
  DataProvider, 
  LayoutProvider,
  RefreshControl
} from "recyclerlistview";

import VideoPlayer from './VideoPlayer';

const window = Dimensions.get('window');

const FetchVideos = () => {
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
      <VideoPlayer streamURI={videosList[index].playbackUrl} />
    )
  };

  const fetchNext = async () => {
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
      onEndReached={fetchNext}
    /> : <></>
  );
};

export default FetchVideos;
