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
} from '@chakra-ui/react'
import { MODE } from '../constants'
import { HotelProp, hotelSelector, setHotels } from '../../../redux/slices'
import { RatingComponent } from '../../../UI/Component'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

interface CreateOrEditHotelProps {
  hotelToEdit?: HotelProp
  mode: string
  isOpen: boolean
  onClose: any
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
    address: hotelToEdit?.address ?? '',
    rank: hotelToEdit?.rank ?? 0,
    brand: hotelToEdit?.brand ?? '',
    id: hotelToEdit?.id ?? '',
  }),[hotelToEdit])

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

  }

  const parseModeProps = (mode: string) => {
    switch (mode) {
      case MODE.EDITING:
        return {
          title: 'EdIting this hotel',
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
    if(isOpen && mode === MODE.CREATING) {
      setHotelDTO( details => ({
        ...details,
        id: uuid(),
      }))
    }
  },[isOpen, mode])

  useEffect(() => {
    if(!isOpen) {
      setHotelDTO(() => defaultHotelDTO)
    }
  },[isOpen])

  const onChange = (e: any) => {
		setHotelDTO((details) => ({ ...details, [e.target.name]: e.target.value }))
	}

  const isInvalid = () => (
    !hotelDTO.name ||
    !hotelDTO.city || !hotelDTO.country ||
    !hotelDTO.id
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

                <Box
                  w={'100%'} 
                  h={'100%'}
                  p={3}
                  border={'1px solid black'}
                  borderRadius={8}
                >
                  <AspectRatio 
                    w={'100%'} 
                    h={'100%'} 
                    ratio={16 / 9}
                  >
                    <iframe
                      title='hotelAddress'
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316452784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1567723392506!5m2!1sen!2sng'
                    />
                  </AspectRatio>
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