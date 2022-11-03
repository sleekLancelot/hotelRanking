import React, { useId, useState, useEffect, useCallback } from 'react'
import { Box, Button, chakra, Divider, FormControl, HStack, Icon, SimpleGrid, useBreakpointValue, useDisclosure, useToast } from '@chakra-ui/react'
import {IoMdAdd,IoMdAddCircle} from 'react-icons/io'
import { Select } from 'chakra-react-select'
import { parseOptions } from '../helpers'
import { ColorModeSwitcher } from '../../../UI/theme'
import { MODE } from '../constants'
import { CreateOrEditHotel } from './CreateOrEditHotel'
import { HotelProp, hotelSelector, setHotelBrands, setHotels } from '../../../redux/slices'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { Hotel, HotelAlertDialog } from '../../../UI/Component'
import { deleteNestedNullObj, filterFn } from '../../../utils'

const AllHotelsScreen = () => {
  const [hotelToDisplay, setHotelToDisplay] = useState<Array<any>>([])
  const [filterTerms, setFilterTerms] = useState<Array<any>>([])
  const [hotelToDelete, setHotelToDelete] = useState<any>({})
  const [operatingMode, setOperatingMode] = useState(MODE.CREATING)


  const { isOpen, onOpen, onClose } = useDisclosure()

  const createBtnVariation = useBreakpointValue(
    {
      base: {
        leftIcon: undefined,
        children: <Icon w={8} h={8} as={IoMdAddCircle} />,
      },
      md: {
        leftIcon: <IoMdAdd />,
        children: 'Create',
      },
    },
    { ssr: false },
  )

  const {
    hotels,
    brands,
  } = useAppSelector( hotelSelector )
  const dispatch = useAppDispatch()

  const parseBrands = useCallback((hotels: Array<HotelProp>) => {
    if (!!hotels?.length) {
      return hotels?.reduce((acc: Array<string>, currentValue) => 
        !!currentValue?.brand && !acc?.includes(currentValue?.brand) ?
          [...acc, currentValue?.brand] :
            [...acc]
      , [])
    } else {
      return []
    }
  }, [hotels])

  useEffect(() => {
    dispatch( setHotelBrands(parseBrands(hotels)) )
  },[hotels])

  const fetchHotelsFromStorage = useCallback(() => {
    return JSON.parse(localStorage.getItem('hotelsInStorage') || '[]')
  },[])

  useEffect(() => {
    dispatch( setHotels( fetchHotelsFromStorage() ) )
  },[])

  const getSearchTerms = useCallback(() => {
    return filterTerms.map( term => term?.value)
  },[filterTerms])

  useEffect(() => {
    if(!!filterTerms?.length) {
      const filteredHotels = hotels?.map( hotel => getSearchTerms().includes(hotel?.brand) ? hotel : null)
      
      setHotelToDisplay(() => deleteNestedNullObj(filteredHotels))
    } else {
      setHotelToDisplay(() => hotels)
    }
  }, [filterTerms, hotels])

  const { 
    isOpen: isAlertOpen, 
    onOpen: onAlertOpen, 
    onClose: onAlertClose,
  } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    if(!isAlertOpen) {
      setHotelToDelete(() => {})
    }
  },[isAlertOpen])

  const deleteHotel = (id: string) => {
    const newHotelData = hotels?.filter( hotel => hotel?.id !== id)

    dispatch( setHotels(newHotelData) )

    localStorage.setItem('hotelsInStorage', JSON.stringify(newHotelData))

    toast({
      title: 'Deleted',
      description: `Hotel successfully deleted`,
      position: 'bottom-right',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    }) 
  }

  return (
    <Box overflowX={'hidden'}>
      <HStack
        w={'100vw'}
        justifyContent={'space-between'}
        alignItems={'center'}
        p={3}
      >
        <Button
          w={{base: 8, md:'100px'}}
          // color={'white'}
          // margin={30}
          _hover={{
            bg: 'teal.500',
          }}
          colorScheme='teal'
          variant='solid'
          // fontSize={13}
          borderRadius={{base: '50%', md: 8}}
          alignSelf={'right'}
          leftIcon={createBtnVariation?.leftIcon}
          onClick={() => {
            onOpen()
            setOperatingMode(MODE.CREATING)
          }}
        >
          {createBtnVariation?.children}
        </Button>

        <HStack justifyContent={'space-between'} minW={{base: '40vh', md: 300}}>
          <FormControl>
            <Select
              name='brands'
              instanceId={useId()}
              autoFocus={false}
              placeholder={'Filter by brand'}
              colorScheme={'teal.500'}
              // closeMenuOnScroll
              isSearchable
              //isClearable
              isMulti
              value={filterTerms}
              options={parseOptions(brands)}
              onChange={setFilterTerms as any}
              noOptionsMessage={() => 'No brands at the moment'}
              />
          </FormControl>

          <ColorModeSwitcher justifySelf="flex-end" />
        </HStack>
      </HStack>

      <CreateOrEditHotel
        mode={operatingMode}
        isOpen={isOpen}
        onClose={onClose}
      />

      <HotelAlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        title={`Delete ${hotelToDelete?.name}`}
        body={`Are you sure you want to delete ${hotelToDelete?.name} hotel`}
        action={() => {
          deleteHotel(hotelToDelete?.id as string)
          setHotelToDelete({})
          onAlertClose()
        }}
      />

      <Box>
        {
          !!brands?.length &&
          brands?.map( (brand, index) => (
            <Box key={index} my={5} mx={[5,10]}>
              {
                !!hotelToDisplay?.length &&
                hotelToDisplay?.some( hotel => hotel?.brand === brand) &&
                <>
                  <chakra.h3
                    textAlign={'left'}
                    color={'gray.500'}
                  >{brand}</chakra.h3>
                  <Divider mr={2} my={3} />
                </>
              }

              <SimpleGrid columns={{base: 1, md: 3}} spacingX='30px' spacingY='20px'>
                {
                  !!hotelToDisplay?.length &&
                  hotelToDisplay?.map( (hotel, index) => (
                    !!hotel?.brand &&
                    hotel?.brand?.toLocaleLowerCase() === brand?.toLocaleLowerCase() &&
                    <Hotel
                      key={index}
                      hotel={hotel}
                      editHotel={() => {}}
                      deleteHotel={() => {
                        onAlertOpen()
                        setHotelToDelete(() => hotel)
                      }}
                    />
                  ))
                }
              </SimpleGrid>
            </Box>
          ))
        }

        {
          !!hotelToDisplay?.length &&
          hotelToDisplay?.some( hotel => !hotel?.brand) &&
          <Box my={5} mx={[5,10]}>
            <chakra.h6
                textAlign={'left'}
                color={'gray.700'}
              >Hotels with no brand</chakra.h6>
            <Divider mr={2} my={3} />
              <SimpleGrid columns={{base: 1, md: 3}} spacingX='30px' spacingY='20px'>
                {
                  hotelToDisplay?.map( (hotel, index) => (
                    !hotel?.brand &&
                    <Hotel
                      key={index}
                      hotel={hotel}
                      editHotel={() => {}}
                      deleteHotel={() => {
                        onAlertOpen()
                        setHotelToDelete(() => hotel)
                      }}
                    />
                  ))
                }
              </SimpleGrid>
          </Box>
        }

      </Box>
      
    </Box>
  )
}

export {AllHotelsScreen}