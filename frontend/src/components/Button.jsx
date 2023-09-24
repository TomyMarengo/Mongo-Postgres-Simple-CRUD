import { useState } from 'react'

export function Button () {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleClick = () => {
    setIsFollowing(!isFollowing)
  }

  const text = isFollowing ? 'Following' : 'Follow'

  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}
