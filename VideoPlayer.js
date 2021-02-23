import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Video from 'react-native-video';

const VideoPlayer = ({streamURI}) => {
    return (
      <View style={styles.fullWidth}>
        <Video
          source = {{uri: streamURI, type: 'm3u8'}}
          style = {styles.fullScreen}
          fullScreen={true}
          resizeMode="cover"
          rate = {1}
          volume = {1}
        />
      </View>
    )
  };

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fullWidth: {
    width: '100%',
    height: '100%',
    backgroundColor: 'blue'
  }
});

export default VideoPlayer;
