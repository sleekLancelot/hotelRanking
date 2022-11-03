import React, { useState, useMemo } from "react";
// import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import { Box, useTheme } from '@chakra-ui/react'
import ReactMapGl from "react-map-gl";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;


const API_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

interface MapComponentProp {
    address: {
        latitude: number,
        longitude: number
    }
    setAddress: any
}

const MapComponent = ({
    address,
    setAddress,
}: MapComponentProp) => {
    const initialViewPort = useMemo(() => ({
        width: "100vw",
        height: "100vh",
        latitude: address?.latitude || 38.91,
        longitude: address?.longitude || -77.0305,
        zoom: 19
    }), [address])

  const [viewport, setViewport] = useState(initialViewPort);

  const theme = useTheme()

  return (
    // <ThemeProvider theme={theme}>
    //   <CSSReset />
      <Box
        h={'100vh'}
        w={'100%'}
      >
        <ReactMapGl
        mapboxAccessToken={API_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        {...viewport}
        initialViewState={viewport}
        // onViewportChange={(newViewport: any) =>{
        //     setViewport(newViewport)
        // }}
        onDrag={(newViewport: any) =>{
            setViewport( prev => ({
                ...prev,
                ...newViewport?.viewState
            }))
        }}
        onClick={(env) => {
          setAddress(env.lngLat);
        }}
      />
      </Box>
    // </ThemeProvider>
  );
}

export {MapComponent}