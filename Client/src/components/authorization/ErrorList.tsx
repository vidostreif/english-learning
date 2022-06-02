import React from 'react'

interface IProps {
  list: Array<string>
}

const ErrorList: React.FC<IProps> = ({ list }) => {
  if (list.length === 0) {
    return <ul className="ErrorValidation"></ul>
  } else {
    return (
      <ul className="ErrorValidation">
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }
}

export default ErrorList
