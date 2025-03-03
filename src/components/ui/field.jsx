import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react'
import * as React from 'react'

export const Field = React.forwardRef(function Field(props, ref) {
  const { label, children, helperText, errorText, optionalText, isRequired, ...rest } = props
  
  return (
    <FormControl ref={ref} isRequired={isRequired} {...rest}>
      {label && (
        <FormLabel>
          {label}
          {!isRequired && optionalText && <span style={{marginLeft: '4px'}}>({optionalText})</span>}
        </FormLabel>
      )}
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
    </FormControl>
  )
})
