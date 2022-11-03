import React, {useMemo, useState, useEffect} from 'react'
import { Box, Icon } from "@chakra-ui/react";
import {AiFillStar} from 'react-icons/ai'

interface RatingIconProp {
    index: number
    rank: number
    hoverRating: number
    onMouseEnter: Function
    onMouseLeave: Function
    onSaveRating: Function
}

const RatingIcon = ({
    index,
    rank,
    hoverRating,
    onMouseEnter,
    onMouseLeave,
    onSaveRating,
}: RatingIconProp) => {
    const [rating, setRating] = useState(rank ?? 0);

    const color = useMemo(() => {
      if (hoverRating >= index) {
        return 'yellow';
      } else if (!hoverRating && rating >= index) {
        return 'yellow';
      }
      return 'none';
    }, [rating, hoverRating, index]);

    useEffect(() => {
      setRating(rank)
    }, [rank])

    return (
        <Box 
          cursor={'pointer'}
          onMouseEnter={() => onMouseEnter(index)} 
          onMouseLeave={() => onMouseLeave()} 
          onClick={() => onSaveRating(index)}
        >
          <Icon as={AiFillStar} color={color} />
        </Box>
    )
  }

export {RatingIcon}