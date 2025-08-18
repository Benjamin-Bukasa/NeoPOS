import React from 'react'
// import ArticleItems from '../features/ArticleItems'
import ArticleFilterPanel from '../features/ArticleFilterPanel'

function Orders() {
  return (
    <div className='w-full flex justify-center md:overflow-y-auto scrollbar-hide'>
      {/* <ArticleItems/> */}
      <ArticleFilterPanel/>
    </div>
  )
}

export default Orders