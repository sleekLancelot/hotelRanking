import React,{ useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
	AlertDialogCloseButton,
	Button,
} from '@chakra-ui/react'

interface DialogProp {
	isOpen: boolean
	onClose: any
	title?: string
	body?: string
	actionBtnText?: string
	action?: any
}

const HotelAlertDialog = ({
	isOpen,
	onClose,
	title= 'Alert',
	body= 'Are you sure you want to perform this action',
	actionBtnText= 'Yes',
	action= () => {},
}: DialogProp) => {
	const cancelRef = useRef<any>()

	return(
		<AlertDialog
			motionPreset='slideInRight'
			leastDestructiveRef={cancelRef}
			onClose={onClose}
			isOpen={isOpen}
			isCentered
		>
			<AlertDialogOverlay />

			<AlertDialogContent>
				<AlertDialogHeader>
					{title}
				</AlertDialogHeader>
				<AlertDialogCloseButton />
				<AlertDialogBody>
					{body}
				</AlertDialogBody>
				<AlertDialogFooter>
					<Button ref={cancelRef} onClick={onClose}>
						No
					</Button>
					<Button colorScheme='red' ml={3} onClick={action}>
						{actionBtnText}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export {HotelAlertDialog}