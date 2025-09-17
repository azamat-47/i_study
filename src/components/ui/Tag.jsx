import React from 'react'
import { Tag } from 'antd'
import { DollarCircleFilled } from '@ant-design/icons'

const TagUi = ({color, children}) => {
  const tagColor = color || 'green'
  return (
    <Tag icon={<DollarCircleFilled />} color={tagColor}>{children}</Tag>
  )
}

export default TagUi
