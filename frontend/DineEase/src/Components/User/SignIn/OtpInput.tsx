import React from 'react'
import { MuiOtpInput } from 'mui-one-time-password-input'
export const OtpHandler = () => {
  const [value, setValue] = React.useState<string>('')

  const handleChange = (newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className='h-8 w-1/4 flex flex-col'>
      <MuiOtpInput
        value={value}
        onChange={handleChange}
        length={6}
        autoFocus
      />
    </div>
  )
}