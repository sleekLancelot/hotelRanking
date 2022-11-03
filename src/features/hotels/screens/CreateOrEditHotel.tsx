import React, { useState, useEffect, useRef, useMemo } from 'react'
import uuid from 'react-uuid';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  useToast,
  Flex,
  Spacer,
  AspectRatio,
  FormHelperText,
} from '@chakra-ui/react'
import { MODE } from '../constants'
import { HotelProp, hotelSelector, setHotels } from '../../../redux/slices'
import { MapComponent, RatingComponent } from '../../../UI/Component'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

interface CreateOrEditHotelProps {
  hotelToEdit?: HotelProp
  mode: string
  isOpen: boolean
  onClose: any
}

interface HotelAddress {
  latitude: number,
  longitude: number,
}

const CreateOrEditHotel = ({
  hotelToEdit,
  mode,
  isOpen,
  onClose,
}: CreateOrEditHotelProps ) => {
  const defaultHotelDTO = useMemo(() => ({
    name: hotelToEdit?.name ?? '',
    city: hotelToEdit?.city ?? '',
    country: hotelToEdit?.country ?? '',
    address: hotelToEdit?.address ?? {
      latitude: undefined,
      longitude: undefined,
    },
    rank: hotelToEdit?.rank ?? 0,
    brand: hotelToEdit?.brand ?? '',
    id: hotelToEdit?.id ?? '',
  }), [hotelToEdit])

  const [hotelDTO, setHotelDTO] = useState(defaultHotelDTO)

  const initialRef = useRef(null)
  const finalRef = useRef(null)
  const toast = useToast()

  const {
    hotels,
    brands,
  } = useAppSelector( hotelSelector )
  const dispatch = useAppDispatch()

  const createHotel = () => {
    const hotelsToStore = [...hotels, hotelDTO]

    dispatch( setHotels(hotelsToStore) )

    localStorage.setItem('hotelsInStorage', JSON.stringify(hotelsToStore))

    onClose()
    
    toast({
      title: 'Hotel Created',
      description: `An hotel with the name ${hotelDTO.name} has been created`,
      position: 'bottom-right',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  const editHotel = () => {
    const hotelsToStore = hotels?.map( hotel => (
      hotel?.id !== hotelToEdit?.id ?
        hotel :
        hotelDTO
    ))

    dispatch( setHotels(hotelsToStore) )

    localStorage.setItem('hotelsInStorage', JSON.stringify(hotelsToStore))

    onClose()
    
    toast({
      title: 'Hotel Edited',
      description: `An hotel with the name ${hotelDTO.name} has been edited`,
      position: 'bottom-right',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  const parseModeProps = (mode: string) => {
    switch (mode) {
      case MODE.EDITING:
        return {
          title: `Editing ${hotelToEdit?.name} hotel`,
          submitAction: editHotel,
        }
    
      case MODE.CREATING:
      default:
        return {
          title: 'Create an hotel',
          submitAction: createHotel,
        }
    }
  }

  useEffect(() => {
    if(mode === MODE.CREATING) {
      if(!isOpen) {
        setHotelDTO(() => ({
          name: '',
          city: '',
          country: '',
          address: {
            latitude: undefined,
            longitude: undefined,
          },
          rank: 0,
          brand: '',
          id: '',
        }))
      } else { 
        setHotelDTO( details => ({
          ...details,
          id: uuid(),
        }))
      }
    }

    if(mode === MODE.EDITING) {
      if(!isOpen) {
        setHotelDTO(() => ({
          name: '',
          city: '',
          country: '',
          address: {
            latitude: undefined,
            longitude: undefined,
          },
          rank: 0,
          brand: '',
          id: '',
        }))
      } else { 
        setHotelDTO(() => defaultHotelDTO)
      }
    }
  },[defaultHotelDTO, isOpen, mode])

  const onChange = (e: any) => {
		setHotelDTO((details) => ({ ...details, [e.target.name]: e.target.value }))
	}

  const isInvalid = () => (
    !hotelDTO.name || !hotelDTO.city ||
    !hotelDTO.country || !hotelDTO.id ||
    hotelDTO.address.latitude === undefined || hotelDTO.address.longitude === undefined
  )

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      size={'full'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{parseModeProps(mode)?.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex flexDirection={{base: 'column', md: 'row'}}>
            <Box flexBasis={{base: '100%', md: '40%'}}>
              <FormControl mb={5} isRequired id='name'>
                <FormLabel>Name</FormLabel>
                <Input
                  ref={initialRef}
                  name='name'
                  value={hotelDTO.name}
                  onChange={onChange}
                  placeholder='name'
                />
              </FormControl>

              <FormControl mb={5} isRequired id='city'>
                <FormLabel>City</FormLabel>
                <Input
                  name='city'
                  value={hotelDTO.city}
                  onChange={onChange}
                  placeholder='city'
                />
              </FormControl>
              
              <FormControl mb={5} isRequired id='country'>
                <FormLabel>Country</FormLabel>
                <Input
                  name='country'
                  value={hotelDTO.country}
                  onChange={onChange}
                  placeholder='country'
                />
              </FormControl>
              
              {/* <FormControl mb={5} isRequired id='address'>
                <FormLabel>Address</FormLabel>
                <Input
                  name='address'
                  value={hotelDTO.address}
                  onChange={onChange}
                  placeholder='address'
                />
              </FormControl> */}
              
              <FormControl mb={5} id='rank'>
                <FormLabel>Rank</FormLabel>
                <RatingComponent
                  rank={hotelDTO.rank}
                  saveRankToControlledInput={(rank: number) => setHotelDTO( details => ({
                    ...details,
                    rank,
                  }))}
                />
              </FormControl>
              
              <FormControl mb={5} id='brand'>
                <FormLabel>Brand</FormLabel>
                <Input
                  name='brand'
                  value={hotelDTO.brand}
                  onChange={onChange}
                  placeholder='brand'
                />
              </FormControl>
            </Box>

            <Spacer />

            <Box flexBasis={{base: '100%', md: '40%'}}>
              <FormControl 
                w={'100%'} 
                h={'100%'} 
                mb={5}
                id='address'
                isRequired
              >
                <FormLabel>Address</FormLabel>
                  <FormHelperText mb={5}>Click on a spot to save the address</FormHelperText>
                <Box
                  w={'100%'} 
                  h={'100%'}
                  p={3}
                  border={'1px solid black'}
                  borderRadius={8}
                >
                  <MapComponent
                      address={hotelDTO?.address as HotelAddress}
                      setAddress={(env: any) => setHotelDTO( details => ({
                        ...details,
                        address: {
                          latitude: env.lat,
                          longitude: env.lng,
                        }
                      }))}

                    />
                </Box>                
              </FormControl>
            </Box>
          </Flex>

        </ModalBody>
        
        <ModalFooter>
        <Button 
          mr={3}
          _hover={{
            bg: 'teal.500',
          }}
          colorScheme='teal'
          disabled={isInvalid()}
          onClick={() => parseModeProps(mode)?.submitAction()}
        >
          Save
        </Button>
        <Button
          variant={'outline'}
          onClick={onClose}
        >Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export {CreateOrEditHotel}