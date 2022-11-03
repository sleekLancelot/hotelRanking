import React, {useState} from 'react'
import { Box, HStack } from '@chakra-ui/react';
import { RatingIcon } from './RatingIcon';

interface RatingComponentProp {
    rank: number,
    saveRankToControlledInput: Function,
}

const RatingComponent = ({
    rank,
    saveRankToControlledInput,
}: RatingComponentProp ) => {
    const [rating, setRating] = useState(rank ?? 0);
    const [hoverRating, setHoverRating] = useState(0);
    const onMouseEnter = (index: number) => {
        setHoverRating(index);
    };
    const onMouseLeave = () => {
        setHoverRating(0);
    };
    const onSaveRating = (index: number) => {
        setRating(index);
        saveRankToControlledInput(index)
    };

  return (
    <HStack>
      {[1, 2, 3, 4, 5].map((index) => (
          <RatingIcon
            key={index}
            index={index} 
            rating={rating} 
            hoverRating={hoverRating} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave} 
            onSaveRating={onSaveRating} />
        )
      )}
    </HStack>
  )
}

export {RatingComponent}