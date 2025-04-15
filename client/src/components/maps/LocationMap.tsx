import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import env from '../../config/env';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  latitude,
  longitude,
  title = 'Location',
  description = '',
}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={title}
          description={description}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default LocationMap; 