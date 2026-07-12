interface Images {
  auth: string
  emptyRoom: string
  email: string
  verified: string
}

const images: Images = {
  auth: require('./auth.png'),
  emptyRoom: require('./no-room.png'),
  email: require('./email.jpg'),
  verified: require('./verified.webp')
}

export default images
