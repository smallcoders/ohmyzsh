import { history } from 'umi'

history.listen((location, action) => {
  if (location) {
    console.log(location)
    console.log(action)
  }
})