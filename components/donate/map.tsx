import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// Define the type for props that the Map component will accept
interface MapProps {
  onLocationChange: (lat: number, lng: number) => void;
  location: { lat: number; lng: number };
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map: React.FC<MapProps> = ({ onLocationChange, location }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={10}
      onClick={(e) => {
        const lat = e.latLng?.lat() ?? 0;
        const lng = e.latLng?.lng() ?? 0;
        onLocationChange(lat, lng);
      }}
    >
      <Marker position={location} />
    </GoogleMap>
  );
};

export default Map;
