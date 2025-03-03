import {
  Accordion,
  AccordionItem as ChakraAccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack
} from '@chakra-ui/react'
import * as React from 'react'
import { LuChevronDown } from 'react-icons/lu'

export const AccordionItemTrigger = React.forwardRef(
  function AccordionItemTrigger(props, ref) {
    const { children, indicatorPlacement = 'end', ...rest } = props
    return (
      <AccordionButton {...rest} ref={ref}>
        {indicatorPlacement === 'start' && (
          <AccordionIcon>
            <LuChevronDown />
          </AccordionIcon>
        )}
        <HStack gap='4' flex='1' textAlign='start' width='full'>
          {children}
        </HStack>
        {indicatorPlacement === 'end' && (
          <AccordionIcon>
            <LuChevronDown />
          </AccordionIcon>
        )}
      </AccordionButton>
    )
  },
)

export const AccordionItemContent = React.forwardRef(
  function AccordionItemContent(props, ref) {
    return (
      <AccordionPanel {...props} ref={ref} />
    )
  },
)

export const AccordionRoot = Accordion
export const AccordionItem = ChakraAccordionItem
