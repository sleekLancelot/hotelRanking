import {
    Box,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
    Button,
    Badge,
    Icon,
} from '@chakra-ui/react';
import {BsStarFill} from 'react-icons/bs';
import { HotelProp } from '../../../redux/slices';
  
  const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

interface HotelComponentProps {
    hotel: HotelProp
    editHotel: any,
    deleteHotel: any,
}

const Hotel = ({
    hotel,
    editHotel,
    deleteHotel,
}: HotelComponentProps) => {
    return (
        <Box
        mt={10}
          role={'group'}
          p={6}
          maxW={'330px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'lg'}
          pos={'relative'}
          zIndex={1}
        >
          <Box
            rounded={'lg'}
            mt={-12}
            pos={'relative'}
            height={'230px'}
            _after={{
              transition: 'all .3s ease',
              content: '""',
              w: 'full',
              h: 'full',
              pos: 'absolute',
              top: 5,
              left: 0,
              backgroundImage: `url(${IMAGE})`,
              filter: 'blur(15px)',
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: 'blur(20px)',
              },
            }}>
            <Image
              rounded={'lg'}
              height={230}
              width={282}
              objectFit={'cover'}
              src={IMAGE}
            />
          </Box>
          <Stack pt={10} align={'center'}>
            <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                {hotel?.name}
            </Heading>

            {
                !!hotel?.brand &&
                <Text color={'gray.500'} fontSize={'sm'} textTransform={'capitalize'}>
                Brand: {hotel?.brand}
                </Text>
            }


            <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
                <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    fontWeight={'400'}>
                    {hotel?.city}
                </Badge>
                <Text>,</Text>
                <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    fontWeight={'400'}>
                    {hotel?.country}
                </Badge>
            </Stack>
            
            <Stack direction={'row'} align={'center'}>
              {
                Array(5)
                .fill('')
                .map((_, index) => (
                    <Icon
                        key={index}
                        as={BsStarFill}
                        color={hotel?.rank as number > index ? 'yellow' : 'gray.300'}
                    />
                ))
              }
            </Stack>
          </Stack>

            <Stack mt={8} direction={'row'} spacing={4}>
                <Button
                    flex={1}
                    fontSize={'sm'}
                    rounded={'full'}
                    _focus={{
                    bg: 'gray.200',
                    }}
                    onClick={() => editHotel()}
                >
                    edit
                </Button>
                <Button
                    flex={1}
                    fontSize={'sm'}
                    rounded={'full'}
                    bg={'red.400'}
                    // color={'white'}
                    boxShadow={
                    '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                    }
                    _hover={{
                    bg: 'red.500',
                    }}
                    _focus={{
                    bg: 'red.500',
                    }}
                    onClick={() => deleteHotel()}
                >
                    delete
                </Button>
            </Stack>
        </Box>
    );
  }

export {Hotel}