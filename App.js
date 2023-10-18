import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, TextInput, View, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

export default function App() {
  const [location, setLocation] = useState();
  const [address, setAddress] = useState();

  const [markerCoordinate, setMarkerCoordinate] = useState(null);

  Location.setGoogleApiKey("");

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location:");
      console.log(currentLocation);
      console.log(address);
    };
    getPermissions();
  }, []);

  const [mapRegion, setMapRegion] = useState({
    latitude: location ? location.coords.latitude : 0,
    longitude: location ? location.coords.longitude : 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const geocode = async () => {
    if (!address) {
      console.error("Address is empty. Please enter a valid address.");
      return;
    }
    try {
      const geocodedLocation = await Location.geocodeAsync(address);
      if (geocodedLocation.length > 0) {
        const firstResult = geocodedLocation[0];
        setMapRegion({
          latitude: firstResult.latitude,
          longitude: firstResult.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        
        console.log("Geocoded Address:");
        console.log(geocodedLocation);
      } else {
        console.error("No geocoding results found.");
      }
    } catch (error) {
      console.error("Error geocoding the address:", error);
    }
  };

  const showCurrentLocation = () => {
    if (location) {
      setMarkerCoordinate({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      console.error("Current location is not available.");
    }
  };

  const reverseGeocode = async () => {
    try {
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
      if (reverseGeocodedAddress.length > 0) {
        const firstResult = reverseGeocodedAddress[0];
        setMapRegion({
          latitude: firstResult.latitude,
          longitude: firstResult.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        console.log("Reverse Geocoded:");
        console.log(reverseGeocodedAddress);

        Alert.alert(
          "Reverse Geocoded Address",
          `${firstResult.name}, ${firstResult.city}, ${firstResult.region}`,
          [{ text: "OK" }]
        );        

      } else {
        console.error("No reverse geocoding results found.");
      }
    } catch (error) {
      console.error("Error reverse geocoding the location:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Geocode Address" onPress={geocode} />
      <Button
        title="Reverse Geocode Current Location"
        onPress={reverseGeocode}
      />
      <Button title="Show Current Location" onPress={showCurrentLocation} />
      <MapView style={{ flex: 1, width: "100%" }} region={mapRegion}>
        {markerCoordinate && (
          <Marker
            coordinate={markerCoordinate}
            title="Current Location"
            description="This is your current location"
          />
        )}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
