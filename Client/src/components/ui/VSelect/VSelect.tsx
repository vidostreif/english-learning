import React from 'react'

interface IOptions {
  readonly value: string
  readonly name: string
}

interface IProps {
  readonly options: Array<IOptions>
  readonly defaultValue: string
  readonly value: string
  readonly onChange: (value: string) => void
}

const VSelect: React.FC<IProps> = ({
  options,
  defaultValue,
  value,
  onChange,
}) => {
  return (
    <select
      name={defaultValue}
      value={value}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>): void =>
        onChange(event.target.value)
      }
    >
      <option disabled value="">
        {defaultValue}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  )
}

export default VSelect
