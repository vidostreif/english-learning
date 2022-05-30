import React, { useState } from 'react'
import styles from './DisplayImage.module.scss'

interface IProps {
  readonly setImg: (img: File, url: string) => void // событие изменения картинки
}

// модуль выбора картинки для задания
const DisplayImage: React.FC<IProps> = ({ setImg }) => {
  const [image, setImage] = useState<string>(null!)

  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0]
      setImage(URL.createObjectURL(img))
      setImg(img, URL.createObjectURL(img))
    }
  }

  return (
    <input
      className={styles.input}
      type="file"
      name="myImage"
      onChange={onImageChange}
    />
  )
}
export default DisplayImage
